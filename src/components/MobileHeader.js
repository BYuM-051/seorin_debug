import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MobileHeader(){
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <header>
            <div className="titleDIV">
                <span className="titleSPAN">SCOREBOARD</span>
            </div>
            <div className="mobile-nav">
                <div onClick = {() => navigate("/")} className = {`nav-button ${location.pathname === "/" ? "active-link" : ""}`}>Dashboard</div>
                <div onClick = {() => navigate("/history")} className = {`nav-button ${location.pathname === "/history" ? "active-link" : ""}`}>History</div>
            </div>
        </header>
    );
}