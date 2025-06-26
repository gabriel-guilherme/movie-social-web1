import React from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useUserContext } from '../../contexts/UserContext';

import './index.css';

export default function Footer() {
    const navigate = useNavigate();
    const user = useUserContext();

    function logout() {
        axios.post('http://localhost:3001/logout', {}, { withCredentials: true })
            .then(() => {
            navigate('/login');
            })
            .catch(() => {
            alert('Erro ao deslogar');
            });
    }
    function toHome() {
        navigate('/home');
    }
    function toCatalog() {
        navigate('/catalog');
    }
    function toProfile() {
        navigate('/profile/' + user.username);
    }
    return (
        <div id="footer">
            <div id="footer-itens">
                <div>
                    <p className="footer-item">Menu</p>
                    <div onClick={toHome} className="footer-menu-link">Inicio</div><br/>
                    <div onClick={toCatalog} className="footer-menu-link">Filmes</div><br/>
                    <div onClick={toProfile} className="footer-menu-link">Perfil</div><br/>
                    <div onClick={logout} className="footer-menu-link">Sair</div><br/>
                </div>
                <div id="footer-dev">
                    <p className="footer-item">Desenvolvedores</p>
                    <p className="footer-item-nome">Joás Leon Rocha Melo</p>
                    <p className="footer-item-nome">Gabriel Guilherme Cavalcanti da Costa</p>
                    <p className="footer-item-nome">Zeus Justino de Lima</p>
                    <p className="footer-item-nome">Raphael Cezar Sabbado</p>
                </div>
                <div>
                    <p className="footer-item">Envie-nos um Email</p>
                    <div className="footer-menu-link">leon.rocha.702@ufrn.edu.br</div><br/>
                    <div className="footer-menu-link">gabriel377@live.com</div><br/>
                    <div className="footer-menu-link">zeuslima360@gmail.com</div><br/>
                    <div className="footer-menu-link">brsabbadobr@gmail.com</div><br/>
                </div>
            </div>
            <div id="footer-copyright">
                <p>Copyright © 2025</p>
            </div>
        </div>
    );
}