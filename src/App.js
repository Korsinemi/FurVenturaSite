import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './utils/privateRoutes.js';
import PlayerList from './pages/PlayerList.js';
import AnimalList from './pages/AnimalList.js';
import EventPage from './pages/EventList.js';
import AuthPage from './pages/auth.js'
import About from './pages/About.js';
import './styles/App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('Authorization');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('Authorization');
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <div className="App">
                <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
                <Routes>
                    <Route path="/about" element={<About />} />
                    <Route path="/account" element={<AuthPage />} />
                    <Route path="/players" element={<PrivateRoute element={<PlayerList />} isLoggedIn={isLoggedIn} />} />
                    <Route path="/animals" element={<PrivateRoute element={<AnimalList />} isLoggedIn={isLoggedIn} />} />
                    <Route path="/events" element={<PrivateRoute element={<EventPage />} isLoggedIn={isLoggedIn} />} />
                    <Route path="/" element={
                        <main>
                            <Helmet>
                                <title>FurVentura</title>
                            </Helmet>
                            <h2>Bienvenido a FurVentura</h2>
                            <p>FurVentura es un emocionante juego de aventuras donde puedes explorar un mundo lleno de animales pixelados. Únete a nosotros y descubre todos los misterios que FurVentura tiene para ofrecer.</p>
                        </main>
                    } />
                </Routes>
                <Footer />
            </div>
        </Router >
    );
}

export default App;