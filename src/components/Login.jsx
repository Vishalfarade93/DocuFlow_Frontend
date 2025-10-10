import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      redirectByRole(userData.authorities);
    }
  }, []);

  const redirectByRole = (authorities) => {
    if (!authorities || authorities.length === 0) return;

    const roles = authorities.map(auth => 
      typeof auth === 'string' ? auth : auth.authority
    );

    if (roles.some(r => r.includes('SUBMITTERS') || r.includes('Submitters'))) {
      navigate('/submit', { replace: true });
    } else if (roles.some(r => r.includes('REVIEWERS') || r.includes('Reviewers'))) {
      navigate('/review', { replace: true });
    } else if (roles.some(r => r.includes('APPROVERS') || r.includes('Approvers'))) {
      navigate('/approve', { replace: true });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new URLSearchParams();
      formData.append('username', username.trim());
      formData.append('password', password);

      const response = await fetch('http://localhost:9191/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: formData.toString()
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store user info with authorities
        sessionStorage.setItem('user', JSON.stringify(data));
        sessionStorage.setItem('authenticated', 'true');

        // Redirect based on role
        redirectByRole(data.authorities);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      margin: 0
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '20px'
        }}>Login</h2>

        {error && (
          <div style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#555'
            }}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#555'
            }}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;