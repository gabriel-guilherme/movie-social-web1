import React from "react";
import './index.css';

import SideBar from "../SideBar";

export default function NavSideBar() {
    return (
        <SideBar title={"Navigation Side Bar"} className="nav-side-bar" headerContent={
            <div id="logo-container">
                <img src="/img/logo.png" className="logo" alt="Logo" />
            </div>
            
        }>
            <ul className="nav-list">
                <li className="nav-item"><img src="/img/svg/home.svg" className="nav-item-image" alt="Home"/>Home</li>
                <li className="nav-item"><img src="/img/svg/pictures.svg" className="nav-item-image" alt="Pictures"/>About</li>
                <li className="nav-item"><img src="/img/svg/folders.svg" className="nav-item-image" alt="folders"/>Services</li>
                <li className="nav-item"><img src="/img/svg/tags.svg" className="nav-item-image" alt="tags"/>Contact</li>
            </ul>
        </SideBar>
    );
}