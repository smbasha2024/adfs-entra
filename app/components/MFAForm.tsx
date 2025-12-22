'use client';

import { useState } from 'react';

interface MFAFormProps {
  sessionId: string;
  email: string;
  onVerifySuccess: (token: string, userInfo: any) => void;
  onBack: () => void;
}

export default function MFAForm({ sessionId, email, onVerifySuccess, onBack }: MFAFormProps) {
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp_code: otpCode,
          session_id: sessionId
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onVerifySuccess(data.access_token, data.user_info);
      } else {
        alert(data.detail || 'MFA verification failed');
      }
    } catch (error) {
      console.error('MFA error:', error);
      alert('MFA verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mfa-form">
      <h2>Multi-Factor Authentication</h2>
      <p>Enter the verification code sent to {email}</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Verification Code:</label>
          <input
            type="text"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="Enter 6-digit code"
            required
            disabled={loading}
            maxLength={6}
          />
        </div>

        <div className="button-group">
          <button type="button" onClick={onBack} disabled={loading}>
            Back
          </button>
          <button type="submit" disabled={loading || otpCode.length !== 6}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </form>

      <div className="mfa-options">
        <button 
          onClick={() => {/* Resend OTP */}}
          disabled={loading}
        >
          Resend Code
        </button>
      </div>
    </div>
  );
}