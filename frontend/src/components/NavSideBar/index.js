import React from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideBar from "../SideBar";
import {FaHome, FaTags, FaDoorClosed, FaUser} from "react-icons/fa"

import './index.css';

export default function NavSideBar() {
    const navigate = useNavigate();
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

    return (
        <SideBar title={"Navigation Side Bar"} className="nav-side-bar" headerContent={
            <div id="logo-container">
                <img src="/img/logo.png" className="logo" alt="Logo" />
            </div>
            
        }>
            <ul className="nav-list">
                <li className="nav-item" onClick={toHome}><FaHome/>Home</li>
                <li className="nav-item"><FaTags/>Movies</li>
                <li className="nav-item"><FaUser/>BProfile</li>
                <li className="nav-item" onClick={logout}><FaDoorClosed/>Logout</li>
            </ul>
            <div className="nav-footer">
                <p>© 2023 Movie App</p>
            </div>
            
        </SideBar>
    );
}