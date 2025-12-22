'use client';

import { useState, useEffect } from 'react';

interface SAMLLoginProps {
  onLoginSuccess: (token: string, userInfo: any) => void;
}

export default function SAMLLogin({ onLoginSuccess }: SAMLLoginProps) {
  const [loading, setLoading] = useState(false);
  const [samlRequest, setSamlRequest] = useState<any>(null);

  useEffect(() => {
    // Get SAML request when component mounts
    fetchSAMLAuthRequest();
  }, []);

  const fetchSAMLAuthRequest = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/saml/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_id: 'app-c' }),
      });

      const data = await response.json();
      if (response.ok) {
        setSamlRequest(data);
      }
    } catch (error) {
      console.error('Failed to get SAML request:', error);
    }
  };

  const handleSAMLResponse = async (samlResponse: string) => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/auth/saml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          saml_response: samlResponse,
          app_id: 'app-c'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data.access_token, data.user_info);
      } else {
        alert(data.detail || 'SAML authentication failed');
      }
    } catch (error) {
      console.error('SAML error:', error);
      alert('SAML authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Mock ADFS redirect - in production this would be actual redirect
  const mockADFSLogin = () => {
    setLoading(true);
    
    // Simulate ADFS redirect and SAML response
    setTimeout(() => {
      const mockSAMLResponse = btoa('<mock-saml-response>');
      handleSAMLResponse(mockSAMLResponse);
    }, 2000);
  };

  return (
    <div className="saml-login">
      <h2>Enterprise Login (ADFS)</h2>
      
      <div className="saml-info">
        <p>Sign in using your company's ADFS credentials</p>
      </div>

      <button 
        onClick={mockADFSLogin}
        disabled={loading}
        className="saml-button"
      >
        {loading ? 'Redirecting to ADFS...' : 'Sign in with ADFS'}
      </button>

      {samlRequest && (
        <div className="saml-redirect-info">
          <p>Would redirect to: {samlRequest.redirect_url}</p>
        </div>
      )}

      <div className="alternative-login">
        <p>Or use standard login:</p>
        {/* Link to standard login form */}
      </div>
    </div>
  );
}