// components/EmailSignup.jsx
import { useState, type FormEvent } from 'react';
import GeneratedLayout from './GeneratedLayout';
import { apiClient } from '../../lib/apiClient';

type SubmissionStatus = 'idle' | 'success' | 'error';

const EmailSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await apiClient.post('/api/email-signup', { email });
      setStatus('success');
    } catch (error) {
      setStatus('error');
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (status !== 'idle') {
      setStatus('idle');
    }
  };

  return (
    <GeneratedLayout>
      <div className="email-signup-container">
        <h3>Get Your Free Party Songs Guide!</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(event) => handleEmailChange(event.target.value)}
            placeholder="Enter your email"
            required
            disabled={isSubmitting}
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Get My Free Guide'}
          </button>
        </form>
        {status === 'success' && <p>Thanks! Check your email for the guide.</p>}
        {status === 'error' && <p>Oops! Something went wrong. Please try again.</p>}
      </div>
    </GeneratedLayout>
  );
};

export default EmailSignup;
