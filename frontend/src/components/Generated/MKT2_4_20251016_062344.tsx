// components/EmailSignup.jsx
import React, { useState } from 'react';
import axios from 'axios';

const EmailSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/email-signup', { email });
      setStatus('success');
      // Trigger welcome email sequence
    } catch (error) {
      setStatus('error');
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="email-signup-container">
      <h3>Get Your Free Party Songs Guide!</h3>
      <form onSubmit={handleSubmit}>
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Get My Free Guide</button>
      </form>
      {status === 'success' && <p>Thanks! Check your email for the guide.</p>}
      {status === 'error' && <p>Oops! Something went wrong. Please try again.</p>}
    </div>
  );
};

export default EmailSignup;
