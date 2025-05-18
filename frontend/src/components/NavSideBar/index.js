import React from "react";
import axios from 'axios';
import SideBar from "../SideBar";
import {FaHome, FaTags, FaDoorClosed, FaUser} from "react-icons/fa"

import './index.css';

export default function NavSideBar() {
    function logout() {
    axios.post('http://localhost:3001/logout', {}, { withCredentials: true })
        .then(() => {
        window.location.href = '/login'; // redireciona para login após logout
        })
        .catch(() => {
        alert('Erro ao deslogar');
        });
    }

    return (
        <SideBar title={"Navigation Side Bar"} className="nav-side-bar" headerContent={
            <div id="logo-container">
                <img src="/img/logo.png" className="logo" alt="Logo" />
            </div>
            
        }>
            <ul className="nav-list">
                <li className="nav-item"><FaHome/>Home</li>
                <li className="nav-item"><FaTags/>Movies</li>
                <li className="nav-item"><FaUser/>Profile</li>
                <li className="nav-item" onClick={logout}><FaDoorClosed/>Logout</li>
            </ul>
            <div className="nav-footer">
                <p>© 2023 Movie App</p>
            </div>
            
        </SideBar>
    );
}