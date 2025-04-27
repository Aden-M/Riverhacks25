// /api/support.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// POST /api/support
router.post('/', async (req, res) => { // ✅ Only '/' because we already mount as /api/support
    try {
        const userMessage = req.body.message;

        // ⚠️ TODO: Add input validation/sanitization for security in the future.

        const lmResponse = await axios.post('http://192.168.3.6:1234/v1/chat/completions', {
            messages: [
                { role: "user", content: userMessage }
            ],
            stream: false
        });

        const aiReply = lmResponse.data?.choices?.[0]?.message?.content || 'No reply from AI.';

        res.json({ reply: aiReply });
    } catch (error) {
        console.error('Error communicating with LM Studio:', error.message);
        res.status(500).json({ error: 'Failed to process support request.' });
    }
});

module.exports = router;
