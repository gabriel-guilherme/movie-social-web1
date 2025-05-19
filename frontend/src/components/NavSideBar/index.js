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

    function toCatalog() {
        navigate('/catalog');
    }

    return (
        <SideBar title={"Navigation Side Bar"} className="nav-side-bar" headerContent={
            <h1>Movie<br/> &nbsp; Social</h1>
            
        }>
            <div className="nav-list">
                <div className="nav-item" onClick={toHome}><FaHome/>Home</div><br/>
                <div className="nav-item" onClick={toCatalog}><FaTags/>Movies</div><br/>
                <div className="nav-item"><FaUser/>Profile</div><br/>
                <div className="nav-item" onClick={logout}><FaDoorClosed/>Logout</div><br/>
            </div>
            <div className="nav-footer">
                <p>© 2023 Movie App</p>
            </div>
        </SideBar>
    );
}