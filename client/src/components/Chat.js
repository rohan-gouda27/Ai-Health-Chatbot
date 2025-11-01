import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Send, ArrowLeft, Trash2, LogOut, Mic, MicOff, Download, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import './Chat.css';

const Chat = ({ user, onLogout, darkMode, toggleDarkMode }) => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatTitle, setChatTitle] = useState('New Chat');
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChat = useCallback(async () => {
    try {
      const response = await axios.get(`/api/chat/${user.id}/${chatId}`);
      setMessages(response.data.messages);
      setChatTitle(response.data.title);
    } catch (error) {
      console.error('Error fetching chat:', error);
      navigate('/dashboard');
    }
  }, [user.id, chatId, navigate]);

  useEffect(() => {
    if (chatId) {
      fetchChat();
    }
  }, [chatId, fetchChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    // Add user message immediately
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      let response;
      if (chatId) {
        // Add to existing chat
        response = await axios.post(`/api/chat/${user.id}/${chatId}/message`, {
          message: userMessage
        });
        setMessages(response.data.messages);
      } else {
        // Create new chat
        response = await axios.post(`/api/chat/${user.id}`, {
          message: userMessage
        });
        setMessages(response.data.messages);
        setChatTitle(response.data.title);
        navigate(`/chat/${response.data._id}`, { replace: true });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the user message if there was an error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const deleteChat = async () => {
    if (!chatId || !window.confirm('Are you sure you want to delete this chat?')) {
      return;
    }

    try {
      await axios.delete(`/api/chat/${user.id}/${chatId}`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  // Voice Recognition
  useEffect(() => {
    const savedVoiceEnabled = localStorage.getItem('voiceEnabled');
    if (savedVoiceEnabled === 'true') {
      setVoiceEnabled(true);
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleVoice = () => {
    const newVoiceEnabled = !voiceEnabled;
    setVoiceEnabled(newVoiceEnabled);
    localStorage.setItem('voiceEnabled', newVoiceEnabled);
    
    if (!newVoiceEnabled && isListening) {
      stopListening();
    }
  };

  // Quick actions for health-related queries
  const quickActions = [
    { text: "What are common cold symptoms?", icon: "🤧" },
    { text: "How to improve sleep quality?", icon: "😴" },
    { text: "Tips for staying hydrated", icon: "💧" },
    { text: "Exercise recommendations", icon: "🏃" }
  ];

  const handleQuickAction = (action) => {
    setInputMessage(action.text);
  };

  // Export chat
  const exportChat = () => {
    const chatContent = messages.map(msg => {
      const role = msg.role === 'user' ? 'You' : 'AI Assistant';
      const time = new Date(msg.timestamp).toLocaleString();
      return `${role} (${time}):\n${msg.content}\n\n`;
    }).join('='.repeat(50) + '\n\n');

    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chatTitle || 'chat'}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="header-left">
          <Link to="/dashboard" className="back-btn">
            <ArrowLeft size={20} />
          </Link>
          <h1>{chatId ? chatTitle : '🩺 AI Health Assistant'}</h1>
        </div>
        <div className="header-right">
          <span>Welcome, {user.username}</span>
          {chatId && messages.length > 0 && (
            <button onClick={exportChat} className="btn btn-icon" title="Export Chat">
              <Download size={16} />
            </button>
          )}
          {chatId && (
            <button onClick={deleteChat} className="btn btn-danger">
              <Trash2 size={16} />
            </button>
          )}
          <button onClick={onLogout} className="btn btn-secondary">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <Sparkles size={48} className="empty-icon" />
            <h2>Describe your symptoms or ask a health question</h2>
            <p>Examples: "I have a sore throat and fever" or "What are signs of dehydration?"</p>
            
            <div className="quick-actions">
              <p className="quick-actions-title">Or try these quick questions:</p>
              <div className="quick-actions-grid">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="quick-action-btn"
                  >
                    <span className="quick-action-icon">{action.icon}</span>
                    <span className="quick-action-text">{action.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-content">
                {message.role === 'assistant' ? (
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
              <div className="message-time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="chat-input-form">
        <div className="input-container">
          <button
            type="button"
            onClick={voiceEnabled && isListening ? stopListening : startListening}
            className={`voice-btn ${isListening ? 'listening' : ''}`}
            disabled={!voiceEnabled || loading}
            title={voiceEnabled ? (isListening ? 'Stop Recording' : 'Start Voice Input') : 'Enable voice in settings'}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
            disabled={loading}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={loading || !inputMessage.trim()}
          >
            <Send size={20} />
          </button>
        </div>
        <div className="disclaimer" style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
          This chatbot provides informational support and is not a medical diagnosis. Call local emergency services for urgent symptoms.
        </div>
      </form>
    </div>
  );
};

export default Chat;