const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        googleId: { type: String, required: true, unique: true },
        email: { type: String, required: true },
        name: { type: String, required: true },
        picture: { type: String, default: '' },

        // Google OAuth tokens
        accessToken: { type: String, default: '' },
        refreshToken: { type: String, default: '' },

        // Google resource IDs (created on first use)
        driveRootFolderId: { type: String, default: null },
        driveCategoryFolders: {
            type: Map,
            of: String,
            default: {},
        },
        sheetsId: { type: String, default: null },

        // App data
        plan: { type: String, enum: ['free', 'pro'], default: 'free' },
        totalUploads: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
