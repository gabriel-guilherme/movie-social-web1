import React from "react";
import "./index.css"; // ou use seu CSS principal

export default function SideBar({ title, headerContent, children, className = "" }) {
    return (
        <div className={`side-bar ${className}`}>
            <div className="side-bar-header">
                {headerContent ? headerContent : <h1>{title}</h1>}
            </div>
            <div className="side-bar-content">
                {children}
            </div>
        </div>
    );
}