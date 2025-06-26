import React from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideBar from "../SideBar";
import { FaHome, FaTags, FaDoorClosed, FaUser } from "react-icons/fa";

import { useUserContext } from '../../contexts/UserContext';

import './index.css';

export default function NavSideBar({ className, onClose }) {
  const navigate = useNavigate();
  const user = useUserContext();

  function logout() {
    axios.post('http://localhost:3001/logout', {}, { withCredentials: true })
      .then(() => {
        if(onClose) onClose();
        navigate('/login');
      })
      .catch(() => {
        alert('Erro ao deslogar');
      });
  }

  const handleClickLink = (navigateFn) => {
    if(onClose) onClose();
    navigateFn();
  };

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
    <SideBar className={`nav-side-bar ${className || ''}`}>
      <h1>Movie<br /> &nbsp; Social</h1>

      <div className="nav-list">
        <div className="nav-item" onClick={() => handleClickLink(toHome)}><FaHome />Home</div>
        <div className="nav-item" onClick={() => handleClickLink(toCatalog)}><FaTags />Movies</div>
        <div className="nav-item" onClick={() => handleClickLink(toProfile)}><FaUser />Profile</div>
        <div className="nav-item" onClick={logout}><FaDoorClosed />Logout</div>
      </div>

      <div className="nav-footer">
        
      </div>
    </SideBar>
  );
}
