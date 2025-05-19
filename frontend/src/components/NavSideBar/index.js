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
        <SideBar className="nav-side-bar">
            <div className="nav-list">
                <h1>Movie<br/> &nbsp; Social</h1>
                <div className="nav-item" onClick={toHome}><FaHome/>Home</div><br/>
                <div className="nav-item"><FaTags/>Movies</div><br/>
                <div className="nav-item"><FaUser/>Profile</div><br/>
                <div className="nav-item" onClick={logout}><FaDoorClosed/>Logout</div><br/>
            </div>
        </SideBar>
    );
}