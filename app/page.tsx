'use client';

import { useState, useEffect } from 'react';

type AuthStep = 'login' | 'mfa' | 'passkey' | 'dashboard';

import { signIn, signOut, useSession } from "next-auth/react"

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [sessionId, setSessionId] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [authToken, setAuthToken] = useState<string>('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { data: session } = useSession()

  // Check for existing session on component mount
  useEffect(() => {
    const token = localStorage.getItem('app-a-token');
    const user = localStorage.getItem('app-a-user');
    console.log("############# Auth Token ############", token);
    if (token && user) {
      setAuthToken(token);
      setUserInfo(JSON.parse(user));
      setCurrentStep('dashboard');
    }
    
    setLoading(false);
  }, []);

  const handleLoginSuccess = (token: string, userInfo: any) => {
    setAuthToken(token);
    setUserInfo(userInfo);
    localStorage.setItem('app-a-token', token);
    localStorage.setItem('app-a-user', JSON.stringify(userInfo));
    setCurrentStep('dashboard');
  };

  /*
  const handleMFARequired = (sessionId: string, email: string) => {
    setSessionId(sessionId);
    setUserEmail(email);
    setCurrentStep('mfa');
  };

  const handlePasskeyAuth = () => {
    setCurrentStep('passkey');
  };

  const handleBackToLogin = () => {
    setCurrentStep('login');
    setSessionId('');
    setUserEmail('');
  };

  const handleLogout = () => {
    setAuthToken('');
    setUserInfo(null);
    setCurrentStep('login');
    localStorage.removeItem('app-a-token');
    localStorage.removeItem('app-a-user');
  };

  const handlePasskeySuccess = (token: string, userInfo: any) => {
    handleLoginSuccess(token, userInfo);
  };
*/
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading App ADFS Entra...</p>
      </div>
    );
  }

  if (session) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold">Signed In</h1>
        <pre className="mt-4 bg-gray-100 p-4 rounded">
          {JSON.stringify(session, null, 2)}
        </pre>

        <button
          onClick={() => signOut()}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>App ADFS Entra</h1>
          <nav className="app-nav">
            {/*currentStep === 'dashboard' && (
              <button onClick={handleLogout} className="logout-btn">
                Sign Out
              </button>
            )*/}
          </nav>
        </div>
      </header>

      <main className="app-main">
        <div className="auth-container" style={{ textAlign: "center" }}>
          <h2>Authenticate with:</h2>
          <div className="alternative-auth">
            <div className="auth-options">
              <button 
                onClick={() => window.location.href = "/auth/adfssaml/login"}
                disabled={loading}
                className="social-btn"
              >
                Sign in without Azure Entra (Direct ADFS)
              </button>

              <button 
                onClick={() => window.location.href = "/auth/saml/login"}
                disabled={loading}
                className="social-btn"
              >
                Sign in with Azure Entra (SAML)
              </button>

              <button 
                onClick={() => signIn("microsoft-entra-id")}
                disabled={loading}
                className="social-btn"
              >
                Sign in with Azure Entra (OIDC)
              </button>

              {/* 
              <button 
                //onClick={handlePasskeyAuth}
                className="social-btn"
              >
                Use Passkey
              </button>
              */}
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>App ADFS Entra - Part of AppHub Ecosystem</p>
        <div className="app-links">
          <a href="http://localhost:3000">AppHub Portal</a>
          <a href="http://localhost:3002">App B</a>
          <a href="http://localhost:3003">App C</a>
          <a href="http://localhost:3004">Mobile Sim</a>
        </div>
      </footer>
    </div>
  );
}