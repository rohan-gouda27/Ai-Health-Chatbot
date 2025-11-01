import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, LogOut, Plus, Bot, Moon, Sun, Search, TrendingUp, HelpCircle, Bell, User } from 'lucide-react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = ({ user, onLogout, darkMode, toggleDarkMode }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchChats = useCallback(async () => {
    try {
      const response = await axios.get(`/api/chat/${user.id}`);
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <Bot size={32} className="logo-icon" />
            <h1>AI ChatBot Assistant</h1>
          </div>
          <div className="header-actions">
            <Link to="/profile" className="btn btn-icon" title="Health Profile">
              <User size={20} />
            </Link>
            <Link to="/reminders" className="btn btn-icon" title="Reminders">
              <Bell size={20} />
            </Link>
            <Link to="/faq" className="btn btn-icon" title="FAQs">
              <HelpCircle size={20} />
            </Link>
            <span>Welcome, {user.username}</span>
            <button onClick={toggleDarkMode} className="btn btn-icon" title="Toggle Dark Mode">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={onLogout} className="btn btn-secondary">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="chatbot-main">
          <div className="welcome-section">
            <div className="welcome-card">
              <div className="welcome-header">
                <div className="welcome-left">
                  <Bot size={64} className="welcome-icon" />
                  <div className="welcome-text">
                    <h2>🩺 Your AI Health Assistant</h2>
                    <p>Get instant health information, symptom analysis, and wellness tips from our AI-powered health assistant.</p>
                  </div>
                </div>
                {chats.length > 0 && (
                  <div className="welcome-stats">
                    <TrendingUp size={32} className="stat-icon" />
                    <div className="stat-info">
                      <div className="stat-value">{chats.length}</div>
                      <div className="stat-label">Total Conversations</div>
                    </div>
                  </div>
                )}
              </div>
              <Link to="/chat" className="btn btn-primary start-chat-btn">
                <MessageSquare size={20} />
                Start New Chat
              </Link>
            </div>

            <div className="quick-access">
              <h3>⚡ Quick Access</h3>
              <div className="access-grid">
                <Link to="/profile" className="access-card">
                  <User size={24} className="access-icon" />
                  <h4>Health Profile</h4>
                  <p>Manage your medical information</p>
                </Link>
                <Link to="/reminders" className="access-card">
                  <Bell size={24} className="access-icon" />
                  <h4>Reminders</h4>
                  <p>Set medication alerts</p>
                </Link>
                <Link to="/faq" className="access-card">
                  <HelpCircle size={24} className="access-icon" />
                  <h4>FAQs</h4>
                  <p>Common health questions</p>
                </Link>
              </div>
            </div>

            <div className="health-tips">
              <h3>💡 Health Tips</h3>
              <div className="tips-grid">
                <div className="tip-card">
                  <span className="tip-icon">💧</span>
                  <h4>Stay Hydrated</h4>
                  <p>Drink at least 8 glasses of water daily to maintain optimal health</p>
                </div>
                <div className="tip-card">
                  <span className="tip-icon">😴</span>
                  <h4>Quality Sleep</h4>
                  <p>Aim for 7-9 hours of sleep for better physical and mental health</p>
                </div>
                <div className="tip-card">
                  <span className="tip-icon">🧘</span>
                  <h4>Manage Stress</h4>
                  <p>Practice meditation or deep breathing exercises to reduce stress</p>
                </div>
              </div>
            </div>
          </div>

          <div className="chats-section">
            <div className="section-header">
              <h3>Recent Conversations</h3>
              <Link to="/chat" className="btn btn-primary">
                <Plus size={16} />
                New Chat
              </Link>
            </div>

            {chats.length > 0 && (
              <div className="search-container">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search your conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            )}
            
            {loading ? (
              <div className="loading">Loading chats...</div>
            ) : chats.length === 0 ? (
              <div className="empty-state">
                <MessageSquare size={48} />
                <h3>No conversations yet</h3>
                <p>Start your first chat with the AI assistant</p>
                <Link to="/chat" className="btn btn-primary">
                  Start Chatting
                </Link>
              </div>
            ) : (
              <div className="chats-grid">
                {filteredChats.map(chat => (
                  <Link 
                    key={chat._id} 
                    to={`/chat/${chat._id}`} 
                    className="chat-card"
                  >
                    <div className="chat-card-header">
                      <MessageSquare size={20} />
                      <h4>{chat.title}</h4>
                    </div>
                    <p className="chat-date">{new Date(chat.updatedAt).toLocaleDateString()}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;