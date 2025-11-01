import React, { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Mic, MicOff, Bell, BellOff, Download, FileText } from 'lucide-react';
import './Settings.css';

const Settings = ({ darkMode, toggleDarkMode, voiceEnabled, toggleVoice, onBack }) => {
  const [notifications, setNotifications] = useState(true);
  const [exportFormat, setExportFormat] = useState('text');

  const handleExportSettings = () => {
    localStorage.setItem('exportFormat', exportFormat);
    // You can add more export logic here
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <button onClick={onBack} className="back-btn-settings">
          ← Back
        </button>
        <SettingsIcon size={24} className="settings-icon" />
        <h2>Settings</h2>
      </div>

      <div className="settings-content">
        {/* Theme Settings */}
        <div className="settings-section">
          <h3>Appearance</h3>
          <div className="settings-item">
            <div className="settings-item-info">
              <span className="settings-label">Dark Mode</span>
              <span className="settings-description">Switch between light and dark themes</span>
            </div>
            <button 
              onClick={toggleDarkMode} 
              className={`toggle-btn ${darkMode ? 'active' : ''}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>

        {/* Voice Settings */}
        <div className="settings-section">
          <h3>Voice & Audio</h3>
          <div className="settings-item">
            <div className="settings-item-info">
              <span className="settings-label">Voice Input</span>
              <span className="settings-description">Enable microphone for voice messages</span>
            </div>
            <button 
              onClick={toggleVoice} 
              className={`toggle-btn ${voiceEnabled ? 'active' : ''}`}
              aria-label="Toggle voice input"
            >
              {voiceEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="settings-section">
          <h3>Notifications</h3>
          <div className="settings-item">
            <div className="settings-item-info">
              <span className="settings-label">Push Notifications</span>
              <span className="settings-description">Get notified about important updates</span>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)} 
              className={`toggle-btn ${notifications ? 'active' : ''}`}
              aria-label="Toggle notifications"
            >
              {notifications ? <Bell size={20} /> : <BellOff size={20} />}
            </button>
          </div>
        </div>

        {/* Data & Export */}
        <div className="settings-section">
          <h3>Data & Privacy</h3>
          <div className="settings-item">
            <div className="settings-item-info">
              <span className="settings-label">Export Format</span>
              <span className="settings-description">Choose default format for chat exports</span>
            </div>
            <select 
              value={exportFormat} 
              onChange={(e) => setExportFormat(e.target.value)}
              className="settings-select"
            >
              <option value="text">Text File (.txt)</option>
              <option value="pdf">PDF Document</option>
              <option value="json">JSON File</option>
            </select>
          </div>
        </div>

        {/* About Section */}
        <div className="settings-section">
          <h3>About</h3>
          <div className="about-info">
            <p><strong>AI Health Assistant</strong> v1.0.0</p>
            <p>Your personal health companion powered by AI</p>
            <p className="disclaimer-text">
              This application provides informational support and is not a replacement for professional medical advice. 
              Always consult with healthcare professionals for medical concerns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

