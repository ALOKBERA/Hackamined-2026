const { google } = require('googleapis');

const SHEET_HEADERS = [
    'Timestamp',
    'Category',
    'Summary',
    'Date Detected',
    'Action Taken',
    'Drive Link',
    'Calendar Event',
    'Confidence',
];

/**
 * Creates an authenticated Google Sheets client for a user
 */
function getSheetsClient(user) {
    const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL
    );
    auth.setCredentials({
        access_token: user.accessToken,
        refresh_token: user.refreshToken,
    });
    return google.sheets({ version: 'v4', auth });
}

/**
 * Ensures the user has a SnapSense spreadsheet with headers.
 * Creates one if it doesn't exist yet.
 * Returns the spreadsheet ID.
 */
async function ensureUserSheet(user) {
    if (user.sheetsId) return user.sheetsId;

    const sheets = getSheetsClient(user);

    const res = await sheets.spreadsheets.create({
        requestBody: {
            properties: {
                title: '📊 SnapSense AI — Screenshot Log',
            },
            sheets: [
                {
                    properties: { title: 'Screenshots' },
                    data: [
                        {
                            startRow: 0,
                            startColumn: 0,
                            rowData: [
                                {
                                    values: SHEET_HEADERS.map((h) => ({
                                        userEnteredValue: { stringValue: h },
                                        userEnteredFormat: {
                                            backgroundColor: { red: 0.17, green: 0.49, blue: 0.82 },
                                            textFormat: {
                                                bold: true,
                                                foregroundColor: { red: 1, green: 1, blue: 1 },
                                            },
                                        },
                                    })),
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    });

    const spreadsheetId = res.data.spreadsheetId;
    user.sheetsId = spreadsheetId;
    await user.save();

    console.log(`✅ Created Google Sheet for ${user.email}: ${spreadsheetId}`);
    return spreadsheetId;
}

/**
 * Appends a row to the user's SnapSense spreadsheet.
 * @param {Object} user - User model instance
 * @param {Object} rowData - { timestamp, category, summary, dateDetected, actionTaken, driveLink, calendarEventLink, confidence }
 */
async function appendRow(user, rowData) {
    const spreadsheetId = await ensureUserSheet(user);
    const sheets = getSheetsClient(user);

    const values = [
        rowData.timestamp || new Date().toISOString(),
        rowData.category || '',
        rowData.summary || '',
        rowData.dateDetected || '',
        rowData.actionTaken || 'none',
        rowData.driveLink || '',
        rowData.calendarEventLink || '',
        rowData.confidence ? `${Math.round(rowData.confidence * 100)}%` : '',
    ];

    const appendRes = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Screenshots!A:H',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [values],
        },
    });

    // Return the row number that was appended
    const updatedRange = appendRes.data.updates?.updatedRange || '';
    const rowMatch = updatedRange.match(/:([A-Z]+)(\d+)$/);
    return rowMatch ? parseInt(rowMatch[2]) : null;
}

module.exports = { ensureUserSheet, appendRow };
