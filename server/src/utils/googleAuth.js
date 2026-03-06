const { google } = require('googleapis');
const User = require('../models/User');

/**
 * Creates and configures an OAuth2 client for a user.
 * Automatically handles token refreshing and saves new tokens to the database.
 */
async function getAuthenticatedClient(user) {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL
    );

    oauth2Client.setCredentials({
        access_token: user.accessToken,
        refresh_token: user.refreshToken,
    });

    // Listen for token updates (automatic refresh)
    oauth2Client.on('tokens', async (tokens) => {
        if (tokens.refresh_token) {
            // New refresh token received
            await User.findByIdAndUpdate(user._id, {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
            });
            console.log(`🔄 Full token refresh for ${user.email}`);
        } else if (tokens.access_token) {
            // New access token received
            await User.findByIdAndUpdate(user._id, {
                accessToken: tokens.access_token,
            });
            console.log(`🔑 Access token refreshed for ${user.email}`);
        }
    });

    return oauth2Client;
}

module.exports = { getAuthenticatedClient };
