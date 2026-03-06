const { google } = require('googleapis');
const User = require('../models/User');

/**
 * Creates and configures an OAuth2 client for a user.
 * Automatically handles token refreshing and saves new tokens to the database.
 */
async function getAuthenticatedClient(user) {
    if (!user) throw new Error('User required for authenticated client');

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL
    );

    oauth2Client.setCredentials({
        access_token: user.accessToken,
        refresh_token: user.refreshToken,
    });

    // Listen for token updates (automatic refresh during requests)
    oauth2Client.on('tokens', async (tokens) => {
        const updateData = {};
        if (tokens.access_token) {
            updateData.accessToken = tokens.access_token;
            user.accessToken = tokens.access_token;
        }
        if (tokens.refresh_token) {
            updateData.refreshToken = tokens.refresh_token;
            user.refreshToken = tokens.refresh_token;
        }

        if (Object.keys(updateData).length > 0) {
            await User.findByIdAndUpdate(user._id, updateData);
            console.log(`🔑 Automatically synchronized refreshed tokens for ${user.email}`);
        }
    });

    // Proactively refresh if we have a refresh token to avoid 401s
    if (user.refreshToken) {
        try {
            // refreshAccessToken forces a refresh even if the client thinks the token is valid
            const { credentials } = await oauth2Client.refreshAccessToken();
            if (credentials.access_token) {
                user.accessToken = credentials.access_token;
                await User.findByIdAndUpdate(user._id, { accessToken: credentials.access_token });
                console.log(`🔄 Proactively refreshed token for ${user.email}`);
            }
        } catch (err) {
            console.error(`❌ Proactive refresh failed for ${user.email}:`, err.message);
            // If the refresh token is invalid/revoked, we should probably clear it
            if (err.message.includes('invalid_grant')) {
                console.warn(`⚠️ Refresh token for ${user.email} is invalid/revoked.`);
                user.refreshToken = '';
                await User.findByIdAndUpdate(user._id, { refreshToken: '' });
            }
        }
    } else {
        console.warn(`⚠️ No refresh token for ${user.email}. Persistent access is disabled.`);
    }

    return oauth2Client;
}

module.exports = { getAuthenticatedClient };
