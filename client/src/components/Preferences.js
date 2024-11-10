import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Preferences.css';
import { Link } from 'react-router-dom';

function Preferences() {
  const [preference, setPreference] = useState('');
  const [customPreference, setCustomPreference] = useState('');
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/'); // Redirect to login if not authenticated
    }
  }, [navigate]);

  const handleSelect = (event) => {
    const selectedPreference = event.target.value;
    setPreference(selectedPreference);
    if (selectedPreference !== 'others') {
      setCustomPreference(''); // Clear custom input when another option is selected
    }
  };

  const handleCustomInput = (event) => {
    setCustomPreference(event.target.value);
  };

  const handleSubmit = () => {
    const finalPreference = preference === 'others' ? customPreference : preference;
    localStorage.setItem('preference', finalPreference); // Store preference in local storage
    navigate('/news'); // Navigate to news page
  };

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Remove user ID from local storage
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="preferences">
      {/* Logout button in top-right corner */}
      <button className="logout-button" onClick={handleLogout}>Logout</button>

      <h2>Select your preferred news topic</h2>
      <select value={preference} onChange={handleSelect}>
        <option value="">Select a topic</option>
        <option value="sports">Sports</option>
        <option value="crime">Crime</option>
        <option value="business">Business</option>
        <option value="technology">Technology</option>
        <option value="entertainment">Entertainment</option>
        <option value="others">Others</option>
      </select>
      {preference === 'others' && (
        <input
          type="text"
          placeholder="Please specify"
          value={customPreference}
          onChange={handleCustomInput}
          required
        />
      )}
      <button onClick={handleSubmit} disabled={!preference || (preference === 'others' && !customPreference)}>
        Continue
      </button>
      <div className="card-container">
        <div className="card">
          <h2>Explore Our Features</h2>
          <div className="card-links">
            <Link to="/forum" className="card-link">Forum</Link>
            <Link to="/live-news" className="card-link">24/7 Live News</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preferences;
