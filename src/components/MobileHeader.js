import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function MobileHeader(){
    const location = useLocation();
    return (
        <header>
            <div className="titleDIV">
                <span className="titleSPAN">SCOREBOARD</span>
            </div>
            {false && <div className="mobile-nav">
                <Link to = "/" className={location.pathname === "/" ? "active-link" : ""}>🏠 Dashboard</Link>
                <Link to = "/history" className={location.pathname === "/history" ? "active-link" : ""}>📜 History</Link>
            </div>}
        </header>
    );
}