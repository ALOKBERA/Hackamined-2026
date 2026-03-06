const { google } = require('googleapis');
const { getAuthenticatedClient } = require('../utils/googleAuth');

/**
 * Creates an authenticated Google Sheets client for a user
 */
async function getSheetsClient(user) {
    const auth = await getAuthenticatedClient(user);
    return google.sheets({ version: 'v4', auth });
}

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

const QUOTE_HEADERS = ['Date of Upload', 'Quote Text', 'Author', 'Drive Link'];
const CONTACT_HEADERS = ['Date of Upload', 'Name', 'Phone', 'Email', 'Organization', 'Drive Link'];
const TICKET_HEADERS = ['Date of Upload', 'Type', 'Origin', 'Destination', 'Date/Time', 'Booking ID', 'Drive Link'];
const PAYMENT_HEADERS = ['Date of Upload', 'Amount', 'Currency', 'Merchant', 'Date', 'Transaction ID', 'Drive Link'];
const LINKEDIN_PROFILE_HEADERS = ['Date of Upload', 'Name', 'Headline', 'Company', 'Location', 'Drive Link'];
const LINKEDIN_POST_HEADERS = ['Date of Upload', 'Author', 'Post Content', 'Date', 'Drive Link'];
const SOCIAL_HEADERS = ['Date of Upload', 'Platform', 'Author', 'Content', 'Drive Link'];
const STUDY_HEADERS = ['Date of Upload', 'Subject', 'Topic', 'Summary', 'Drive Link'];

/**
 * Ensures the user has a SnapSense spreadsheet with required headers and tabs.
 */
async function ensureUserSheet(user) {
    const sheets = await getSheetsClient(user);
    let spreadsheetId = user.sheetsId;

    if (!spreadsheetId) {
        const res = await sheets.spreadsheets.create({
            requestBody: {
                properties: { title: '📊 SnapSense AI — Screenshot Log' },
                sheets: [{ properties: { title: 'Screenshots' } }]
            },
        });
        spreadsheetId = res.data.spreadsheetId;
        user.sheetsId = spreadsheetId;
        await user.save();
    }

    // Check existing sheets and add missing ones
    const ss = await sheets.spreadsheets.get({ spreadsheetId });
    const existingTitles = ss.data.sheets.map(s => s.properties.title);

    const requiredTabs = [
        { title: 'Screenshots', headers: SHEET_HEADERS },
        { title: 'Quotes', headers: QUOTE_HEADERS },
        { title: 'Contacts', headers: CONTACT_HEADERS },
        { title: 'Tickets', headers: TICKET_HEADERS },
        { title: 'Payments', headers: PAYMENT_HEADERS },
        { title: 'LinkedIn Profiles', headers: LINKEDIN_PROFILE_HEADERS },
        { title: 'LinkedIn Posts', headers: LINKEDIN_POST_HEADERS },
        { title: 'Social Media', headers: SOCIAL_HEADERS },
        { title: 'Study Notes', headers: STUDY_HEADERS }
    ];

    for (const tab of requiredTabs) {
        if (!existingTitles.includes(tab.title)) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: {
                    requests: [{
                        addSheet: { properties: { title: tab.title } }
                    }]
                }
            });
        }

        // Ensure headers are present
        const range = `${tab.title}!A1:K1`;
        const headerRes = await sheets.spreadsheets.values.get({ spreadsheetId, range });
        if (!headerRes.data.values || headerRes.data.values.length === 0) {
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range,
                valueInputOption: 'USER_ENTERED',
                requestBody: { values: [tab.headers] }
            });

            // Style the header row
            const sheet = (await sheets.spreadsheets.get({ spreadsheetId })).data.sheets.find(s => s.properties.title === tab.title);
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: {
                    requests: [{
                        repeatCell: {
                            range: { sheetId: sheet.properties.sheetId, startRowIndex: 0, endRowIndex: 1 },
                            cell: {
                                userEnteredFormat: {
                                    backgroundColor: { red: 0.17, green: 0.49, blue: 0.82 },
                                    textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } }
                                }
                            },
                            fields: 'userEnteredFormat(backgroundColor,textFormat)'
                        }
                    }]
                }
            });
        }
    }

    return spreadsheetId;
}

/**
 * Appends a row to a specific tab in the user's SnapSense spreadsheet.
 */
async function appendToSheet(user, tabName, values) {
    const spreadsheetId = await ensureUserSheet(user);
    const sheets = await getSheetsClient(user);

    const appendRes = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${tabName}!A:Z`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [values] },
    });

    const updatedRange = appendRes.data.updates?.updatedRange || '';
    const rowMatch = updatedRange.match(/:([A-Z]+)(\d+)$/);
    return rowMatch ? parseInt(rowMatch[2]) : null;
}

/**
 * Original appendRow (modified to use appendToSheet)
 */
async function appendRow(user, rowData) {
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
    return appendToSheet(user, 'Screenshots', values);
}

module.exports = { ensureUserSheet, appendRow, appendToSheet };
