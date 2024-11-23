import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header({ isLoggedIn, onLogout }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLinkClick = () => {
        setIsDropdownOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                            <li className="dropdown" ref={dropdownRef}>
                                <button className="dropbtn" onClick={handleDropdownToggle}>
                                    Menú
                                </button>
                                <div className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`}>
                                    <Link to="/players" onClick={handleLinkClick}>Jugadores</Link>
                                    <Link to="/animals" onClick={handleLinkClick}>Animalitos</Link>
                                    <Link to="/events" onClick={handleLinkClick}>Eventos</Link>
                                    <Link to="/items" onClick={handleLinkClick}>Items</Link>
                                    <Link to="/achievements" onClick={handleLinkClick}>Logros</Link>
                                    <Link to="/" className="logout" onClick={() => { handleLinkClick(); onLogout(); }}>
                                        Salir
                                    </Link>
                                </div>
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
