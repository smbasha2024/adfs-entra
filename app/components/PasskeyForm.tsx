'use client';

import { useState } from 'react';

interface PasskeyFormProps {
  onAuthSuccess: (token: string, userInfo: any) => void;
  onBack: () => void;
}

export default function PasskeyForm({ onAuthSuccess, onBack }: PasskeyFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasskeyAuth = async () => {
    setLoading(true);

    try {
      // Get passkey challenge from backend
      const challengeResponse = await fetch('http://localhost:8000/auth/passkey/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const challengeData = await challengeResponse.json();

      if (!challengeResponse.ok) {
        throw new Error(challengeData.detail || 'Failed to get challenge');
      }

      // Use WebAuthn API to authenticate with passkey
      const credential = await navigator.credentials.get({
        publicKey: challengeData
      });

      // Send passkey data to backend for verification
      const authResponse = await fetch('http://localhost:8000/auth/passkey/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          passkey_data: credential
        }),
      });

      const authData = await authResponse.json();

      if (authResponse.ok) {
        onAuthSuccess(authData.access_token, authData.user_info);
      } else {
        throw new Error(authData.detail || 'Passkey authentication failed');
      }
    } catch (error) {
      console.error('Passkey error:', error);
      alert('Passkey authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="passkey-form">
      <h2>Sign In with Passkey</h2>
      
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="button-group">
        <button type="button" onClick={onBack} disabled={loading}>
          Back
        </button>
        <button 
          onClick={handlePasskeyAuth} 
          disabled={loading || !email}
        >
          {loading ? 'Authenticating...' : 'Use Passkey'}
        </button>
      </div>

      <div className="passkey-info">
        <p>Make sure you have registered a passkey for this account first.</p>
      </div>
    </div>
  );
}