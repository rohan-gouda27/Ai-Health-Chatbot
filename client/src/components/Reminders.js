import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Plus, Edit, Trash2, CheckCircle2, Circle, Bell, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import './Reminders.css';

const Reminders = ({ user }) => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    notes: '',
    timeOfDay: '',
    frequency: 'daily'
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await axios.get(`/api/reminders/${user.id}`);
      setReminders(response.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/reminders/${user.id}/${editingId}`, formData);
      } else {
        await axios.post(`/api/reminders/${user.id}`, formData);
      }
      await fetchReminders();
      resetForm();
    } catch (error) {
      console.error('Error saving reminder:', error);
      alert('Failed to save reminder');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) {
      return;
    }
    try {
      await axios.delete(`/api/reminders/${user.id}/${id}`);
      await fetchReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const handleToggleActive = async (reminder) => {
    try {
      await axios.put(`/api/reminders/${user.id}/${reminder._id}`, {
        isActive: !reminder.isActive
      });
      await fetchReminders();
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  const handleEdit = (reminder) => {
    setEditingId(reminder._id);
    setFormData({
      title: reminder.title,
      notes: reminder.notes,
      timeOfDay: reminder.timeOfDay,
      frequency: reminder.frequency
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({ title: '', notes: '', timeOfDay: '', frequency: 'daily' });
    setShowAddForm(false);
    setEditingId(null);
  };

  const activeReminders = reminders.filter(r => r.isActive);
  const upcomingReminders = activeReminders.slice(0, 3);

  if (loading) {
    return <div className="loading">Loading reminders...</div>;
  }

  return (
    <div className="reminders-container">
      <header className="reminders-page-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          <ArrowLeft size={20} />
        </button>
        <Bell size={32} className="reminders-icon" />
        <h2>Medication & Reminders</h2>
      </header>

      <div className="reminders-header">
        <div>
          <p>Never miss your medication or important health tasks</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          <Plus size={20} />
          Add Reminder
        </button>
      </div>

      {showAddForm && (
        <div className="reminder-form-card">
          <h3>{editingId ? 'Edit Reminder' : 'New Reminder'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Take Vitamin D"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  value={formData.timeOfDay}
                  onChange={(e) => setFormData({ ...formData, timeOfDay: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes (optional)"
                rows="3"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Create'} Reminder
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {upcomingReminders.length > 0 && (
        <div className="upcoming-reminders">
          <h3>📅 Upcoming Today</h3>
          <div className="reminder-list">
            {upcomingReminders.map(reminder => (
              <div key={reminder._id} className="reminder-item">
                <button
                  onClick={() => handleToggleActive(reminder)}
                  className="check-btn"
                >
                  {reminder.isActive ? (
                    <CheckCircle2 size={20} className="checked" />
                  ) : (
                    <Circle size={20} />
                  )}
                </button>
                <div className="reminder-content">
                  <h4>{reminder.title}</h4>
                  {reminder.notes && <p>{reminder.notes}</p>}
                  <div className="reminder-meta">
                    <Clock size={14} />
                    <span>{reminder.timeOfDay}</span>
                    <span className="badge">{reminder.frequency}</span>
                  </div>
                </div>
                <div className="reminder-actions">
                  <button
                    onClick={() => handleEdit(reminder)}
                    className="btn-icon-small"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(reminder._id)}
                    className="btn-icon-small delete"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reminders.length > 0 && (
        <div className="all-reminders">
          <h3>All Reminders ({reminders.length})</h3>
          <div className="reminder-list">
            {reminders.map(reminder => (
              <div
                key={reminder._id}
                className={`reminder-item ${!reminder.isActive ? 'inactive' : ''}`}
              >
                <button
                  onClick={() => handleToggleActive(reminder)}
                  className="check-btn"
                >
                  {reminder.isActive ? (
                    <CheckCircle2 size={20} className="checked" />
                  ) : (
                    <Circle size={20} />
                  )}
                </button>
                <div className="reminder-content">
                  <h4>{reminder.title}</h4>
                  {reminder.notes && <p>{reminder.notes}</p>}
                  <div className="reminder-meta">
                    <Clock size={14} />
                    <span>{reminder.timeOfDay}</span>
                    <span className="badge">{reminder.frequency}</span>
                    {!reminder.isActive && <span className="badge inactive-badge">Inactive</span>}
                  </div>
                </div>
                <div className="reminder-actions">
                  <button
                    onClick={() => handleEdit(reminder)}
                    className="btn-icon-small"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(reminder._id)}
                    className="btn-icon-small delete"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reminders.length === 0 && !showAddForm && (
        <div className="empty-reminders">
          <Bell size={64} />
          <h3>No reminders yet</h3>
          <p>Add your first medication or health reminder</p>
        </div>
      )}
    </div>
  );
};

export default Reminders;

