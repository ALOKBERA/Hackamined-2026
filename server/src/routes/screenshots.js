const express = require('express');
const multer = require('multer');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { classifyScreenshot } = require('../services/groqService');
const { uploadFileToDrive, deleteFileFromDrive } = require('../services/driveService');
const { appendRow } = require('../services/sheetsService');
const {
    createCalendarEvent,
    shouldCreateCalendarEvent,
} = require('../services/calendarService');
const Screenshot = require('../models/Screenshot');
const User = require('../models/User');

// Multer: in-memory storage (no disk writes)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
});

// ─── POST /api/screenshots/upload ────────────────────────────────────────────
router.post(
    '/upload',
    requireAuth,
    upload.single('screenshot'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res
                    .status(400)
                    .json({ success: false, message: 'No file uploaded' });
            }

            const user = await User.findById(req.user._id);
            const { buffer, mimetype, originalname } = req.file;
            const filename = `${Date.now()}-${originalname}`;

            // ── Step 1: Classify with Groq AI ─────────────────────────────────────
            console.log('🤖 Classifying screenshot...');
            const aiResult = await classifyScreenshot(buffer, mimetype);
            console.log(`✅ Category: ${aiResult.category}`);

            // ── Step 2: Upload to Google Drive ────────────────────────────────────
            console.log('☁️  Uploading to Drive...');
            const driveResult = await uploadFileToDrive(
                user,
                buffer,
                filename,
                mimetype,
                aiResult.category
            );
            console.log(`✅ Drive: ${driveResult.webViewLink}`);

            // ── Step 3: Create Calendar Event (if needed) ─────────────────────────
            let calendarEventId = null;
            let calendarEventLink = null;
            if (shouldCreateCalendarEvent(aiResult.category, aiResult.suggestedAction)) {
                try {
                    console.log('📅 Creating calendar event...');
                    const calResult = await createCalendarEvent(user, {
                        summary: aiResult.summary,
                        description: `Screenshot classified as: ${aiResult.category}`,
                        date: aiResult.date,
                        category: aiResult.category,
                    });
                    calendarEventId = calResult.eventId;
                    calendarEventLink = calResult.eventLink;
                    console.log(`✅ Calendar event: ${calendarEventLink}`);
                } catch (calErr) {
                    console.error('⚠️  Calendar event failed (non-critical):', calErr.message);
                }
            }

            // ── Step 4: Log to Google Sheets ──────────────────────────────────────
            let sheetsRowNumber = null;
            try {
                console.log('📊 Logging to Sheets...');
                sheetsRowNumber = await appendRow(user, {
                    timestamp: new Date().toISOString(),
                    category: aiResult.category,
                    summary: aiResult.summary,
                    dateDetected: aiResult.date || '',
                    actionTaken: calendarEventLink ? 'Calendar event created' : 'Stored',
                    driveLink: driveResult.webViewLink,
                    calendarEventLink: calendarEventLink || '',
                    confidence: aiResult.confidence,
                });
                console.log(`✅ Sheet row: ${sheetsRowNumber}`);
            } catch (sheetErr) {
                console.error('⚠️  Sheets log failed (non-critical):', sheetErr.message);
            }

            // ── Step 5: Save to MongoDB ───────────────────────────────────────────
            const screenshot = await Screenshot.create({
                userId: user._id,
                originalName: originalname,
                mimeType: mimetype,
                category: aiResult.category,
                metadata: {
                    summary: aiResult.summary,
                    date: aiResult.date,
                    suggestedAction: aiResult.suggestedAction,
                    confidence: aiResult.confidence,
                    rawAI: aiResult.rawAI,
                },
                driveFileId: driveResult.fileId,
                driveViewLink: driveResult.webViewLink,
                driveThumbnailLink: driveResult.thumbnailLink,
                calendarEventId,
                calendarEventLink,
                sheetsRowNumber,
            });

            // Increment upload count
            await User.findByIdAndUpdate(user._id, { $inc: { totalUploads: 1 } });

            return res.status(201).json({
                success: true,
                message: `Classified as "${aiResult.category}"`,
                screenshot: {
                    _id: screenshot._id,
                    category: screenshot.category,
                    metadata: screenshot.metadata,
                    driveViewLink: screenshot.driveViewLink,
                    driveThumbnailLink: screenshot.driveThumbnailLink,
                    calendarEventLink: screenshot.calendarEventLink,
                    createdAt: screenshot.createdAt,
                },
            });
        } catch (err) {
            console.error('❌ Upload error:', err);
            return res.status(500).json({
                success: false,
                message: err.message || 'Internal server error',
            });
        }
    }
);

// ─── GET /api/screenshots — All screenshots for user ─────────────────────────
router.get('/', requireAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [screenshots, total] = await Promise.all([
            Screenshot.find({ userId: req.user._id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('-metadata.rawAI'),
            Screenshot.countDocuments({ userId: req.user._id }),
        ]);

        res.json({
            success: true,
            data: screenshots,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── GET /api/screenshots/category/:cat ──────────────────────────────────────
router.get('/category/:cat', requireAuth, async (req, res) => {
    try {
        const category = decodeURIComponent(req.params.cat);
        const screenshots = await Screenshot.find({
            userId: req.user._id,
            category,
        })
            .sort({ createdAt: -1 })
            .select('-metadata.rawAI');

        res.json({ success: true, category, data: screenshots });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── GET /api/screenshots/stats ──────────────────────────────────────────────
router.get('/stats', requireAuth, async (req, res) => {
    try {
        const ALL_CATEGORIES = [
            'Ticket', 'Wallpaper', 'LinkedIn Profile', 'LinkedIn Post',
            'Social Media Post', 'Payment', 'Sensitive Document', 'Contact',
            'Mail', 'Quote', 'WhatsApp Chat', 'Study Notes', 'Other'
        ];

        const aggregatedStats = await Screenshot.aggregate([
            { $match: { userId: req.user._id } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);

        const statsMap = aggregatedStats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        const byCategory = ALL_CATEGORIES.map(category => ({
            category,
            count: statsMap[category] || 0
        }));

        const total = aggregatedStats.reduce((sum, s) => sum + s.count, 0);

        res.json({
            success: true,
            total,
            byCategory,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── DELETE /api/screenshots/:id ─────────────────────────────────────────────
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        // Find first (don't delete yet) so we have the driveFileId
        const screenshot = await Screenshot.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!screenshot) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }

        // ── Step 1: Delete from Google Drive ───────────────────────────────────
        if (screenshot.driveFileId) {
            try {
                const user = await User.findById(req.user._id);
                await deleteFileFromDrive(user, screenshot.driveFileId);
                console.log(`🗑️  Drive file deleted: ${screenshot.driveFileId}`);
            } catch (driveErr) {
                // Non-fatal — log but continue deleting from DB
                console.error('⚠️  Drive delete failed (non-critical):', driveErr.message);
            }
        }

        // ── Step 2: Delete from MongoDB ────────────────────────────────────────
        await Screenshot.findByIdAndDelete(screenshot._id);

        res.json({
            success: true,
            message: 'Screenshot deleted from dashboard and Google Drive',
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
