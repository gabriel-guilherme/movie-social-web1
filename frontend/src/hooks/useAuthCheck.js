// src/hooks/Auth.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function useAuthCheck() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/check-auth', { withCredentials: true })
      .then(() => setLoading(false)) // autenticado libera página
      .catch(() => {
        navigate('/login'); // não autenticado manda pro login
      });
  }, [navigate]);

  return loading;
}
