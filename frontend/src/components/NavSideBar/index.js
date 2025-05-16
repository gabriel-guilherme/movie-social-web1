import React from "react";
import SideBar from "../SideBar";
import {FaHome, FaTags, FaRegUser} from "react-icons/fa"

import './index.css';

export default function NavSideBar() {
    return (
        <SideBar title={"Navigation Side Bar"} className="nav-side-bar" headerContent={
            <div id="logo-container">
                <img src="/img/logo.png" className="logo" alt="Logo" />
            </div>
            
        }>
            <ul className="nav-list">
                <li className="nav-item"><FaHome/>Home</li>
                <li className="nav-item"><FaTags/>Movies</li>
                <li className="nav-item"><FaRegUser/>Profile</li>
            </ul>
            
        </SideBar>
    );
}