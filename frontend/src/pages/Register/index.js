// src/components/Register.jsx
import React, { useState } from 'react';
import useRedirectIfAuth from '../../hooks/useRedirectIfAuth';
import './index.css';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  useRedirectIfAuth();

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
        setError('A senha deve possuir pelo menos 8 dígitos.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        credentials: 'include', // importante para cookies de sessão
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
            'first-name': firstName,
            'last-name': lastName,
            'remember-me': remember ? 'on' : 'off',
        }),
        });

        if (response.ok) {
        window.location.href = '/home';
        } else {
        const message = await response.text();
        setError(message || 'Erro ao registrar.');
        }
    } catch (error) {
        console.error(error);
        setError('Erro ao conectar com o servidor.');
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
            <h2>Cadastrar-se</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="first-name">Primeiro Nome</label>
              <input
                id="first-name"
                name="first-name"
                type="text"
                placeholder="Primeiro Nome"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="last-name">Sobrenome</label>
              <input
                id="last-name"
                name="last-name"
                type="text"
                placeholder="Sobrenome"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="email@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
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
            </div>

            <button type="submit" className="btn-login">
              Cadastrar e Entrar
            </button>
          </form>

          {error && <div id="error-msg">{error}</div>}

          <div className="bottom-button">
            <button
              className="btn-outline"
              onClick={() => (window.location.href = '/login')}
            >
              Já tem uma conta? Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
