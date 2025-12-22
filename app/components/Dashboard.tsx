'use client';

interface DashboardProps {
  userInfo: any;
  onLogout: () => void;
}

export default function Dashboard({ userInfo, onLogout }: DashboardProps) {
  const handleRegisterPasskey = async () => {
    // Implement passkey registration
    alert('Passkey registration would be implemented here');
  };

  return (
    <div className="dashboard">
      <h2>Welcome to App ADFS Entra!</h2>
      <p>You have successfully authenticated.</p>
      
      <div className="user-info">
        <h3>User Information</h3>
        <div className="user-details">
          <pre>{JSON.stringify(userInfo, null, 2)}</pre>
        </div>
      </div>

      <div className="dashboard-actions">
        <button 
          onClick={handleRegisterPasskey}
          className="register-passkey-btn"
        >
          Register Passkey
        </button>
        <button 
          onClick={onLogout}
          className="logout-btn"
        >
          Sign Out
        </button>
      </div>

      <div className="app-features">
        <h3>App ADFS Entra Features</h3>
        <ul>
          <li>✅ Unified authentication with Azure Entra ID</li>
          <li>✅ Single Sign-On across all AppHub applications</li>
          <li>✅ Multi-factor authentication</li>
          <li>✅ Passkey support</li>
          <li>✅ reCAPTCHA protection</li>
        </ul>
      </div>
    </div>
  );
}