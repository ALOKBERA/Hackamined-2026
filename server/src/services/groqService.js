const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const CATEGORIES = [
    'Ticket',
    'Wallpaper',
    'LinkedIn Profile',
    'LinkedIn Post',
    'Social Media Post',
    'Payment',
    'Sensitive Document',
    'Contact',
    'Mail',
    'Quote',
    'WhatsApp Chat',
    'Study Notes',
    'Other',
];

const SYSTEM_PROMPT = `You are SnapSense AI, an expert screenshot classifier. Analyze the given screenshot image and classify it into exactly ONE of these categories:
${CATEGORIES.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Return a JSON object ONLY (no markdown, no extra text) with this exact structure:
{
  "category": "<one of the categories above>",
  "summary": "<one sentence describing the screenshot content>",
  "date": "<ISO 8601 datetime string if a specific date/time is visible, else null>",
  "suggestedAction": "<'calendar' if it should be added to calendar, 'contact' if it should be saved as contact, 'none' otherwise>",
  "confidence": <number between 0 and 1>,
  "extractedData": {
    "quote": { "text": "<the quote text>", "author": "<author name or null>" },
    "contact": { "name": "<person name>", "phone": "<phone number>", "email": "<email address>", "org": "<organization or null>" }
  }
}

Rules for extractedData:
- If category is 'Quote', populate 'quote', leave 'contact' null.
- If category is 'Contact', populate 'contact', leave 'quote' null.
- Otherwise, both 'quote' and 'contact' should be null.
- Always return the full JSON structure even if fields are null.

Rules:
- Ticket: flight/train/bus/event/concert/sports tickets with booking info
- Wallpaper: decorative/aesthetic images used as backgrounds
- LinkedIn Profile: screenshots of a LinkedIn user profile page
- LinkedIn Post: screenshots of a LinkedIn post/article/feed
- Social Media Post: Twitter/Instagram/Facebook/TikTok/Reddit posts
- Payment: receipts, invoices, payment confirmations, bank transactions
- Sensitive Document: Aadhar, PAN, passport, ID cards, medical records, legal docs
- Contact: business cards, contact details, phone numbers
- Mail: email screenshots (Gmail, Outlook, etc.)
- Quote: motivational/inspirational quote images
- WhatsApp Chat: WhatsApp or messaging app conversation screenshots
- Study Notes: handwritten notes, textbook pages, slides, educational content
- Other: anything that doesn't fit above`;

/**
 * Classifies a screenshot image using Groq Vision API
 * @param {Buffer} imageBuffer - The image buffer
 * @param {string} mimeType - The MIME type of the image (e.g., 'image/png')
 * @returns {Promise<{category, summary, date, suggestedAction, confidence}>}
 */
async function classifyScreenshot(imageBuffer, mimeType = 'image/png') {
    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    const response = await groq.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: SYSTEM_PROMPT,
                    },
                    {
                        type: 'image_url',
                        image_url: { url: dataUrl },
                    },
                ],
            },
        ],
        max_tokens: 500,
        temperature: 0.1,
    });

    const rawText = response.choices[0]?.message?.content || '{}';

    try {
        // Strip any markdown code blocks if present
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);

        // Validate category
        if (!CATEGORIES.includes(parsed.category)) {
            parsed.category = 'Other';
        }

        return {
            category: parsed.category || 'Other',
            summary: parsed.summary || 'No summary available',
            date: parsed.date || null,
            suggestedAction: parsed.suggestedAction || 'none',
            confidence: parseFloat(parsed.confidence) || 0.5,
            extractedData: parsed.extractedData || { quote: null, contact: null },
            rawAI: rawText,
        };
    } catch (parseError) {
        console.error('Failed to parse Groq response:', rawText);
        return {
            category: 'Other',
            summary: 'Could not analyze image',
            date: null,
            suggestedAction: 'none',
            confidence: 0,
            rawAI: rawText,
        };
    }
}

module.exports = { classifyScreenshot, CATEGORIES };
