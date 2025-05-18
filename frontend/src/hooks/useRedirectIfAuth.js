// src/hooks/useRedirectIfAuth.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function useRedirectIfAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/check-auth', { withCredentials: true })
      .then(() => {
        navigate('/home'); // já está logado vai pra home
      })
      .catch(() => {
        // não está logado fica na página
      });
  }, [navigate]);
}
