const express = require('./server/node_modules/express');
const mongoose = require('./server/node_modules/mongoose');
const cors = require('./server/node_modules/cors');
const bcrypt = require('./server/node_modules/bcryptjs');
const jwt = require('./server/node_modules/jsonwebtoken');
const { GoogleGenerativeAI } = require('./server/node_modules/@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = 5003;
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/personal-ai-agent')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error:', err));
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', userSchema);

const chatSchema = new mongoose.Schema({
  userId: String,
  title: String,
  messages: [{
    role: String,
    content: String,
    image: String, 
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});


app.post('/api/user/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log('Registration attempt:', { username, email });
    
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists' 
      });
    }
    
    const user = new User({ username, email, password });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
    
    console.log('✅ User registered:', username);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});

// Login
app.post('/api/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
    
    console.log('✅ User logged in:', user.username);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/chat/:userId', async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .select('_id title createdAt');
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chat/:userId', async (req, res) => {
  try {
    const { message, image } = req.body;
    
    console.log('Creating chat with message:', message, image ? 'and image' : '');
    
    let aiResponse;
    let chatTitle;
    
    if (image) {
      const imagePart = {
        inlineData: {
          data: image.split(',')[1],
          mimeType: image.split(';')[0].split(':')[1]
        }
      };
      
      const prompt = message || "What do you see in this image?";
      const result = await model.generateContent([prompt, imagePart]);
      aiResponse = result.response.text();
      chatTitle = message ? message.substring(0, 50) : "Image Analysis";
      
      console.log('✅ Image processed with Gemini Vision');
    } else {
      // Handle text-only input
      const result = await model.generateContent(message);
      aiResponse = result.response.text();
      chatTitle = message.substring(0, 50);
    }
    
    const chat = new Chat({
      userId: req.params.userId,
      title: chatTitle + (chatTitle.length > 50 ? '...' : ''),
      messages: [
        { role: 'user', content: message, image: image ? 'image_uploaded' : null },
        { role: 'assistant', content: aiResponse }
      ]
    });
    
    await chat.save();
    res.json(chat);
    
    console.log('✅ Chat created');
  } catch (error) {
    console.error('Chat creation error:', error);
    res.status(500).json({ error: 'Failed to create chat: ' + error.message });
  }
});

app.post('/api/chat/:userId/:chatId/message', async (req, res) => {
  try {
    const { message, image } = req.body;
    
    const chat = await Chat.findOne({ 
      _id: req.params.chatId, 
      userId: req.params.userId 
    });
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    let aiResponse;
    
    if (image) {
      const imagePart = {
        inlineData: {
          data: image.split(',')[1],
          mimeType: image.split(';')[0].split(':')[1]
        }
      };
      
      const prompt = message || "What do you see in this image?";
      const result = await model.generateContent([prompt, imagePart]);
      aiResponse = result.response.text();
      
      console.log('✅ Image processed with Gemini Vision');
    } else {
      const result = await model.generateContent(message);
      aiResponse = result.response.text();
    }
    
    chat.messages.push({ role: 'user', content: message, image: image ? 'image_uploaded' : null });
    chat.messages.push({ role: 'assistant', content: aiResponse });
    
    await chat.save();
    res.json(chat);
    
    console.log('✅ Message added to chat');
  } catch (error) {
    console.error('Message error:', error);
    res.status(500).json({ error: 'Failed to send message: ' + error.message });
  }
});


app.post('/api/chat/search', async (req, res) => {
  try {
    const { query } = req.body;
    const result = await model.generateContent(`Please help me with this query: ${query}`);
    const answer = result.response.text();
    res.json({ answer });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed: ' + error.message });
  }
});
app.post('/api/chat/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    const result = await model.generateContent(`Please provide a concise summary: ${text}`);
    const summary = result.response.text();
    res.json({ summary });
  } catch (error) {
    console.error('Summarize error:', error);
    res.status(500).json({ error: 'Summarization failed: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📊 API endpoints:');
  console.log('  - POST /api/user/register');
  console.log('  - POST /api/user/login');
  console.log('  - GET  /api/chat/:userId');
  console.log('  - POST /api/chat/:userId');
  console.log('  - POST /api/chat/search');
  console.log('  - POST /api/chat/summarize');
});