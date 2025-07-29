import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Dashboard({ token, setToken }) {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProtected = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/protected', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setUserId(res.data.userId);
      } catch (err) {
        console.error('Unauthorized:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProtected();
  }, [token]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });

      // ✅ Clear access token from memory
      setToken(null);

      // ✅ Redirect to login
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) return <p>Checking authentication...</p>;

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      fontFamily: 'Arial',
    }}>
      <h1>Welcome to the Dashboard ✅</h1>
      {userId && <h2>User ID: {userId}</h2>}
      <p>You are successfully authenticated.</p>

      <button
        style={{
          marginTop: '20px',
          padding: '10px 25px',
          background: '#fff',
          color: '#000',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
          borderRadius: '5px'
        }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
