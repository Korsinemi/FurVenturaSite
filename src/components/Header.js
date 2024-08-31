import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header({ isLoggedIn, onLogout }) {
    return (
        <header>
            <h1>
                <Link to="/" className="logo" alt="FurVentura Logo"></Link>
            </h1>
            <nav>
                <ul>
                    <li><Link to="/about">Sobre Nosotros</Link></li>
                    {isLoggedIn ? (
                        <>
                            <li><Link to="/players">Jugadores</Link></li>
                            <li><Link to="/animals">Animalitos</Link></li>
                            <li><Link to="/events">Eventos</Link></li>
                            <li>
                                <Link to="/" className="logout" onClick={onLogout}>
                                    Salir
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to="/account" className="login">
                                Login
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
