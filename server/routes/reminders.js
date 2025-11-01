const express = require('express');
const Reminder = require('../models/Reminder');

const router = express.Router();

// List reminders for a user
router.get('/:userId', async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.params.userId }).sort({ updatedAt: -1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create reminder
router.post('/:userId', async (req, res) => {
  try {
    const { title, notes = '', timeOfDay, frequency = 'daily', weekday } = req.body || {};
    if (!title || !timeOfDay) {
      return res.status(400).json({ error: 'title and timeOfDay are required' });
    }
    const reminder = new Reminder({
      userId: req.params.userId,
      title,
      notes,
      timeOfDay,
      frequency,
      weekday
    });
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update reminder
router.put('/:userId/:id', async (req, res) => {
  try {
    const update = req.body || {};
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.params.userId },
      update,
      { new: true }
    );
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete reminder
router.delete('/:userId/:id', async (req, res) => {
  try {
    await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.params.userId });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;





