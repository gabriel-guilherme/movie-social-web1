import React from "react";
import './index.css';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
    const navigate = useNavigate();
    function toHome() {
        navigate('/home');
    }
    return (
        <div id="footer">
            <div id="footer-itens">
                <div>
                    <p className="footer-item">Menu</p>
                    <div onClick={toHome} className="footer-menu-link">Home</div><br/>
                    <div onClick={toHome} className="footer-menu-link">Movies</div><br/>
                    <div onClick={toHome} className="footer-menu-link">Profile</div><br/>
                    <div onClick={toHome} className="footer-menu-link">Logout</div><br/>
                </div>
                <div id="footer-dev">
                    <p className="footer-item">Desenvolvedores</p>
                    <p className="footer-item-nome">Joás Leon Rocha Melo</p>
                    <p className="footer-item-nome">Gabriel Guilherme Cavalcanti da Costa</p>
                    <p className="footer-item-nome">Zeus Justino de Lima</p>
                    <p className="footer-item-nome">-----------</p>
                </div>
                <div>
                    <p className="footer-item">Envie-nos um Email</p>
                    <div className="footer-menu-link">leon.rocha.702@ufrn.edu.br</div><br/>
                    <div className="footer-menu-link">gabriel377@live.com</div><br/>
                    <div className="footer-menu-link">zeuslima360@gmail.com</div><br/>
                    <div className="footer-menu-link"></div><br/>
                </div>
            </div>
            <div id="footer-copyrght">
                <p>Copyright © 2025</p>
            </div>
        </div>
    );
}