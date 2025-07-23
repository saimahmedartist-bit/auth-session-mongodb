import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/globals.css'; // Optional: keep your global styles

export default function MyApp({ Component, pageProps }) {
  const [token, setToken] = useState(null);

  // ✅ Try to get a new access token using the refresh token on first load
  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const res = await axios.post('http://localhost:5000/api/refresh-token', {}, {
          withCredentials: true
        });
        setToken(res.data.token);
      } catch (err) {
        setToken(null);
      }
    };
    tryRefresh();
  }, []);

  // ✅ Axios response interceptor: auto-refresh access token on 401/403
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const res = await axios.post('http://localhost:5000/api/refresh-token', {}, {
              withCredentials: true
            });
            const newToken = res.data.token;
            setToken(newToken);

            // Retry the failed request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            console.error('Refresh token failed:', refreshError);
            setToken(null); // Optional: force logout
          }
        }

        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // ✅ Axios request interceptor: attach Authorization token
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => axios.interceptors.request.eject(interceptor);
  }, [token]);

  return <Component {...pageProps} token={token} setToken={setToken} />;
}
