import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
    return (
        <header>
            <h1>
                <Link to="/">FurVentura</Link>
            </h1>
            <nav>
                <ul>
                    <li><Link to="/about">Sobre Nosotros</Link></li>
                    <li><Link to="/players">Jugadores</Link></li>
                    <li><Link to="/account" className="login">Login</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;