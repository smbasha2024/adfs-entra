'use client';

import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface LoginFormProps {
  onLoginSuccess: (token: string, userInfo: any) => void;
  onMFARequired: (sessionId: string, email: string) => void;
}

export default function LoginForm({ onLoginSuccess, onMFARequired }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    //console.log('Environment Variable...', process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
    try {

      console.log("recaptch token when click on sign-in...", recaptchaToken);
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          recaptcha_token: recaptchaToken,
          app_id: '49b8b35e-e7f1-47b1-852f-b882e89185d8'
        }),
      });

      const result = await response.json();
      const data =result.jwt_tokens;
      console.log("Login Session JST Token:", result.jwt_tokens);
      console.log("Login Session AD Token:", result.AD_tokens);

      if (response.ok) {
        if (data.mfa_required) {
          onMFARequired(data.session_id, data.email);
        } else {
          onLoginSuccess(data.access_token, data.user_info);
        }
      } else {
        alert(data.detail || 'Login failed');
        // Reset reCAPTCHA on failure
        recaptchaRef.current?.reset();
        setRecaptchaToken('');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
      // Reset reCAPTCHA on failure
        recaptchaRef.current?.reset();
        setRecaptchaToken('');

    } finally {
      setLoading(false);
    }
  };

  const handleRecaptchaVerify = (token: string | null) => {
    console.log('Token Details before load: ', token);
    setRecaptchaToken(token || '');
  };

  return (
    <div className="login-form">
      <h2>Sign In with Google ReCAPTCHA</h2>
      
      <form onSubmit={handleSubmit}>
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
        
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* reCAPTCHA */}
        <div className="recaptcha-container">
        {/*}
          <div
            className="g-recaptcha"
            data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            data-callback={handleRecaptchaVerify}
          />
          */}

          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
             onChange={handleRecaptchaVerify} // ← This was missing!
          />
    
        </div>

        <button type="submit" disabled={loading || !recaptchaToken}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-options">
        <button 
          onClick={() => {/* Implement social login */}}
          disabled={loading}
        >
          Sign in with Azure AD
        </button>
        
        <button 
          onClick={() => {/* Navigate to passkey */}}
          disabled={loading}
        >
          Sign in with Passkey
        </button>
      </div>
    </div>
  );
}