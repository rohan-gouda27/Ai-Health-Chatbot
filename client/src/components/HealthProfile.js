import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Save, ArrowLeft, Heart, Pill, AlertTriangle } from 'lucide-react';
import './HealthProfile.css';

const HealthProfile = ({ user }) => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    age: '',
    bloodType: '',
    allergies: '',
    currentMedications: '',
    chronicConditions: '',
    emergencyContact: ''
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Save to localStorage for now
    localStorage.setItem(`healthProfile_${user.id}`, JSON.stringify(profile));
    alert('Health profile saved successfully!');
  };

  React.useEffect(() => {
    // Load saved profile
    const saved = localStorage.getItem(`healthProfile_${user.id}`);
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, [user.id]);

  return (
    <div className="health-profile-container">
      <header className="profile-page-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          <ArrowLeft size={20} />
        </button>
        <User size={32} className="profile-icon" />
        <h2>Health Profile</h2>
      </header>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <Heart size={24} />
            <h3>Personal Information</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="profile-form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleChange}
                placeholder="Enter your age"
                min="1"
                max="150"
              />
            </div>

            <div className="profile-form-group">
              <label>Blood Type</label>
              <select
                name="bloodType"
                value={profile.bloodType}
                onChange={handleChange}
              >
                <option value="">Select blood type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="info-section">
              <div className="section-header">
                <AlertTriangle size={20} />
                <h4>Allergies & Reactions</h4>
              </div>
              <div className="profile-form-group">
                <textarea
                  name="allergies"
                  value={profile.allergies}
                  onChange={handleChange}
                  placeholder="List any allergies (medications, food, environmental)"
                  rows="3"
                />
              </div>
            </div>

            <div className="info-section">
              <div className="section-header">
                <Pill size={20} />
                <h4>Current Medications</h4>
              </div>
              <div className="profile-form-group">
                <textarea
                  name="currentMedications"
                  value={profile.currentMedications}
                  onChange={handleChange}
                  placeholder="List current medications and dosages"
                  rows="3"
                />
              </div>
            </div>

            <div className="info-section">
              <div className="section-header">
                <Heart size={20} />
                <h4>Chronic Conditions</h4>
              </div>
              <div className="profile-form-group">
                <textarea
                  name="chronicConditions"
                  value={profile.chronicConditions}
                  onChange={handleChange}
                  placeholder="List any ongoing health conditions"
                  rows="3"
                />
              </div>
            </div>

            <div className="info-section">
              <div className="section-header">
                <User size={20} />
                <h4>Emergency Contact</h4>
              </div>
              <div className="profile-form-group">
                <input
                  type="text"
                  name="emergencyContact"
                  value={profile.emergencyContact}
                  onChange={handleChange}
                  placeholder="Name and phone number"
                />
              </div>
            </div>

            <div className="disclaimer-box">
              <AlertTriangle size={20} />
              <p>This information is stored locally and is not shared with anyone. For medical emergencies, call local emergency services.</p>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                <Save size={20} />
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HealthProfile;


