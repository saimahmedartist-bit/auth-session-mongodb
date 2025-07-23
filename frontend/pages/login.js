import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from './login.module.css'; // ✅ Import CSS module

export default function Login({ setToken }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        email,
        password
      }, {
        withCredentials: true
      });

      setToken(res.data.token);
      router.push('/dashboard');

    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login error');
    }
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleLogin} className={styles.form}>
        <h2 className={styles.heading}>Login</h2>
        {error && <p className={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />

        <button type="submit" className={styles.button}>Login</button>
      </form>
    </div>
  );
}
