const express = require('express');
const passport = require('passport');
const router = express.Router();

// ─── Initiate Google OAuth ────────────────────────────────────────────────────
// Requests ALL scopes at login time
router.get(
    '/google',
    passport.authenticate('google', {
        scope: [
            'profile',
            'email',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/calendar.events',
        ],
        accessType: 'offline',
        prompt: 'consent', // Forces refresh token to be returned
    })
);

// ─── Google OAuth Callback ────────────────────────────────────────────────────
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
    }),
    (req, res) => {
        // Successful authentication
        res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    }
);

// ─── Logout ───────────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Logout failed' });
        }
        req.session.destroy((err2) => {
            res.clearCookie('connect.sid');
            res.json({ success: true, message: 'Logged out successfully' });
        });
    });
});

// ─── Get Current User ─────────────────────────────────────────────────────────
router.get('/me', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, user: null });
    }
    // Don't send tokens to frontend
    const { googleId, accessToken, refreshToken, __v, ...safeUser } =
        req.user.toObject();
    res.json({ success: true, user: safeUser });
});

module.exports = router;
