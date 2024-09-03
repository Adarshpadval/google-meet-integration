import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [meetLink, setMeetLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to create a Google Meet session
  const handleCreateSession = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/create-session'); // Node index api route
      setMeetLink(response.data.meetLink);
    } catch (err) {
      setError('Failed to create Google Meet session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Google Meet Integration</h1>
      <button onClick={handleCreateSession} disabled={loading}>
        {loading ? 'Creating Session...' : 'Create Google Meet Session'}
      </button>
      {error && <p className="error">{error}</p>}
      {meetLink && (
        <div>
          <p>Join the session: <a href={meetLink} target="_blank" rel="noopener noreferrer">{meetLink}</a></p>
        </div>
      )}
    </div>
  );
}

export default App;
