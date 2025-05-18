// src/components/LoginPage.jsx
import React, { useState } from 'react';
import useRedirectIfAuth from '../../hooks/useRedirectIfAuth';
import { useNavigate } from 'react-router-dom';
import './index.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useRedirectIfAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError('A senha deve possuir pelo menos 8 dígitos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // MUITO IMPORTANTE para enviar cookies/sessões
        body: JSON.stringify({ email, password, remember })
      });

      const result = await response.text();

      if (!response.ok) {
        setError(result);
      } else {
        setError('');
        //alert('Login realizado com sucesso!');
        navigate('/home');
      }
    } catch (err) {
      setError('Erro de rede ou servidor.');
    }
  };

  return (
    <div className="container">
      <div id="background"></div>
      <div className="login-layout">
        <img
          src="/img/ticket-background.png"
          alt="Imagem lateral"
          className="side-image"
        />
        <div className="form-container">
          <div className="form-header">
            <h2>Log In</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Endereço de e-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="email@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <small>A senha deve possuir pelo menos 8 dígitos</small>
            </div>

            <div className="form-options">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Lembrar
              </label>
              <button
                type="button"
                className="link-button"
                onClick={() => navigate('/forgot-password')}
              >
                Esqueceu a senha?
              </button>
            </div>

            <button type="submit" className="btn-login">Log In</button>
          </form>

          {error && <div id="error-msg">{error}</div>}

          <div className="bottom-button">
            <button
              className="btn-outline"
              onClick={() => navigate('/register')}
            >
              Criar conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


