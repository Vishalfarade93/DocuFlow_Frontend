import { useNavigate } from 'react-router-dom';

function ApproverPage() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:9191/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    
    sessionStorage.clear();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#ffc107' }}>Approver Dashboard</h1>
        <p>Welcome, <strong>{user.username}</strong>!</p>
        <p>You have approver access. You can approve documents here.</p>
        
        <button 
          onClick={handleLogout}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default ApproverPage;