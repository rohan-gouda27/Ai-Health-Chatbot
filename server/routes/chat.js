const express = require('express');
const Chat = require('../models/Chat');
const geminiService = require('../services/geminiService');
const { redactPII } = require('../utils/redact');

const router = express.Router();

// Get all chats for a user
router.get('/:userId', async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.params.userId })
      .sort({ updatedAt: -1 })
      .select('_id title createdAt updatedAt');
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific chat with messages
router.get('/:userId/:chatId', async (req, res) => {
  try {
    const chat = await Chat.findOne({ 
      _id: req.params.chatId, 
      userId: req.params.userId 
    });
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new chat
router.post('/:userId', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }
    
    // Redact PII
    const safeMessage = redactPII(message);
    // Generate AI response (health domain by default)
    const aiResponse = await geminiService.generateResponse(safeMessage, [], { domain: 'health' });
    
    const chat = new Chat({
      userId: req.params.userId,
      title: `Health: ${safeMessage.substring(0, 45)}${safeMessage.length > 45 ? '...' : ''}`,
      messages: [
        { role: 'user', content: safeMessage },
        { role: 'assistant', content: aiResponse }
      ]
    });
    
    await chat.save();
    res.json(chat);
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add message to existing chat
router.post('/:userId/:chatId/message', async (req, res) => {
  try {
    const { message } = req.body;
    
    const chat = await Chat.findOne({ 
      _id: req.params.chatId, 
      userId: req.params.userId 
    });
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    // Get recent context (last 10 messages)
    const context = chat.messages.slice(-10);
    
    // Redact PII
    const safeMessage = redactPII(message);
    // Generate AI response (health domain by default)
    const aiResponse = await geminiService.generateResponse(safeMessage, context, { domain: 'health' });
    
    // Add messages
    chat.messages.push({ role: 'user', content: safeMessage });
    chat.messages.push({ role: 'assistant', content: aiResponse });
    
    await chat.save();
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete chat
router.delete('/:userId/:chatId', async (req, res) => {
  try {
    await Chat.findOneAndDelete({ 
      _id: req.params.chatId, 
      userId: req.params.userId 
    });
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;