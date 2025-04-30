import React from "react";
import { useNavigate } from "react-router-dom";

export default function MobileHeader(){
    const navigate = useNavigate();
    return (
        <header>
            <div>SCOREBOARD</div>
            <div className="mobile-nav">
                <button onClick={() => navigate("/")}>🏠 Dashboard</button>
                <button onClick={() => navigate("/history")}>📜 History</button>
            </div>
        </header>
    );
}