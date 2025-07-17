import React, { useState } from 'react';
import { updatePassword } from '../api';

const ProfileForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (newPassword !== confirmNewPassword) {
      setMessage('New passwords do not match.');
      setMessageType('error');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('New password must be at least 6 characters long.');
      setMessageType('error');
      return;
    }

    try {
      const data = await updatePassword(currentPassword, newPassword);
      if (data.message) {
        setMessage(data.message);
        setMessageType('success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setMessage(data.message || 'Failed to update password.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error or server issue.');
      setMessageType('error');
      console.error('Password update error:', error);
    }
  };

  return (
    <div className="card profile-form-card">
      <h3>Update Password</h3>
      {message && <div className={`message ${messageType}`}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">Update Password</button>
      </form>
    </div>
  );
};

export default ProfileForm;