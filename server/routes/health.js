const express = require('express');
const geminiService = require('../services/geminiService');

const router = express.Router();

router.post('/symptom-check', async (req, res) => {
  try {
    const { description, context = [] } = req.body || {};
    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'description is required' });
    }

    const aiResponse = await geminiService.generateResponse(
      description,
      context,
      { domain: 'health', task: 'symptom_check' }
    );

    res.json({ result: aiResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;




