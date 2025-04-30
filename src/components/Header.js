import React from "react";
import { Link } from "react-router-dom";

export default function Header( { showNav, role, location, handleLogout}) {
    return(
        <header>
            <div className="titleDIV">
                <img className="logoIMG" src="/logoHeader.png" alt="Logo"/>
                <span className="titleSPAN">SCOREBOARD</span>
            </div>
            {showNav && (<div className="navigationBar">
                <nav className="navLeft">
                    {role === "admin" && (
                    <>
                        <Link to="/admin/dashboard" className={location.pathname === "/admin/dashboard" ? "active-link": ""}>Admin Dashboard</Link>
                        <Link to="/admin/history" className={location.pathname === "/admin/history" ? "active-link": ""}>Admin History</Link>
                    </>
                    )}
                    {role !== "admin" && (
                    <>
                        <Link to="/" className={location.pathname === "/" ? "active-link": ""}>Dashboard</Link>
                        <Link to="/history "className={location.pathname === "/history" ? "active-link": ""}>History</Link>
                    </>
                    )}
                </nav>
                <div className="navRight">
                    {role && (<a onClick={handleLogout}>logout</a>)}
                    {!role && (<Link to = "/login">login</Link>)}
                </div>
                </div>
            )}
        </header>
    );
}
