const express = require('express');

const router = express.Router();

// Minimal verified FAQs (can be expanded or moved to DB)
const FAQS = [
  {
    q: 'What are common symptoms of diabetes?',
    a: 'Common symptoms can include increased thirst, frequent urination, unexplained weight loss, fatigue, and blurred vision. Consult a healthcare professional for evaluation.'
  },
  {
    q: 'How can I reduce fever at home?',
    a: 'Stay hydrated, rest, and consider over-the-counter acetaminophen or ibuprofen if appropriate. Seek care for very high fever, persistent fever, or red flags.'
  },
  {
    q: 'What are signs of dehydration?',
    a: 'Dry mouth, dark urine, dizziness, fatigue, and reduced urination. Rehydrate with water and oral rehydration solutions. Seek care for severe symptoms.'
  },
  {
    q: 'What are common cold symptoms?',
    a: 'Common cold symptoms include runny or stuffy nose, sneezing, sore throat, coughing, mild headache, and slight body aches. Most colds resolve within 7-10 days.'
  },
  {
    q: 'How to improve sleep quality?',
    a: 'Maintain a regular sleep schedule, create a comfortable sleep environment, avoid screens before bed, limit caffeine in the afternoon, and practice relaxation techniques. Aim for 7-9 hours of quality sleep.'
  },
  {
    q: 'Tips for staying hydrated',
    a: 'Drink water throughout the day, carry a reusable water bottle, set hydration reminders, eat water-rich foods like fruits and vegetables, and listen to your body\'s thirst signals.'
  },
  {
    q: 'Exercise recommendations',
    a: 'Adults should aim for at least 150 minutes of moderate-intensity exercise or 75 minutes of vigorous exercise per week. Include strength training, cardio, and flexibility exercises for optimal health.'
  },
  {
    q: 'What are symptoms of COVID-19?',
    a: 'Symptoms can include fever or chills, cough, shortness of breath, fatigue, muscle aches, headache, loss of taste or smell, sore throat, and congestion. Seek medical attention if symptoms are severe.'
  },
  {
    q: 'How to manage stress effectively?',
    a: 'Practice deep breathing, regular exercise, maintain a healthy sleep schedule, connect with loved ones, engage in hobbies, consider meditation or yoga, and seek professional help if needed.'
  },
  {
    q: 'When should I see a doctor?',
    a: 'Seek immediate medical care for severe pain, difficulty breathing, chest pain, sudden confusion, severe injury, high fever that won\'t go down, or any symptom that concerns you. Trust your instincts.'
  }
];

router.get('/', (req, res) => {
  res.json({ faqs: FAQS });
});

router.get('/search', (req, res) => {
  const q = (req.query.q || '').toString().toLowerCase();
  if (!q) return res.json({ faqs: FAQS });
  const results = FAQS.filter(item =>
    item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
  );
  res.json({ faqs: results });
});

module.exports = router;




