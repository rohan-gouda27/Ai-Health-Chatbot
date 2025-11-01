const express = require('express');
const Chat = require('../models/Chat');
const Reminder = require('../models/Reminder');

const router = express.Router();

router.get('/:userId/summary', async (req, res) => {
  try {
    const userId = req.params.userId;
    const [chatCount, recentChats, reminders, activeReminders] = await Promise.all([
      Chat.countDocuments({ userId }),
      Chat.find({ userId }).sort({ updatedAt: -1 }).limit(5).select('_id title updatedAt'),
      Reminder.find({ userId }).sort({ updatedAt: -1 }),
      Reminder.countDocuments({ userId, isActive: true })
    ]);

    const totalMessages = await Chat.aggregate([
      { $match: { userId } },
      { $project: { size: { $size: '$messages' } } },
      { $group: { _id: null, total: { $sum: '$size' } } }
    ]);

    res.json({
      chats: {
        count: chatCount,
        totalMessages: (totalMessages[0] && totalMessages[0].total) || 0,
        recent: recentChats
      },
      reminders: {
        count: reminders.length,
        activeCount: activeReminders,
        items: reminders.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;




