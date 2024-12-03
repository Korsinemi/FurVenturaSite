import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Componentes
import Header from './components/Header.js';
import Footer from './components/Footer.js';

// Utilidades
import PrivateRoute from './utils/privateRoutes.js';

// Páginas
import PlayerList from './pages/PlayerList.js';
import AnimalList from './pages/AnimalList.js';
import EventPage from './pages/EventList.js';
import AuthPage from './pages/auth.js';
import AchievementList from './pages/AchPage.js';
import About from './pages/About.js';
import Home from './pages/Home.js';
import ItemPage from './pages/ItemList.js';
import BlockedPage from './pages/Blocked.js';

import './styles/App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [actualUser, setActualUser] = useState('');
    const [isCheater, setIsCheater] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('Authorization');
        const cheater = localStorage.getItem('Cheater');
        setIsLoggedIn(!!token);
        setIsCheater(cheater === 'true');
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            const username = localStorage.getItem('CurrentUser-Username');
            setActualUser(username);
        }
    }, [isLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem('Authorization');
        localStorage.removeItem('Cheater');
        setIsLoggedIn(false);
        setIsCheater(false);
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
                    <Route path="/items" element={<PrivateRoute element={<ItemPage />} isLoggedIn={isLoggedIn} />} />
                    <Route path="/achievements" element={<PrivateRoute element={<AchievementList />} isLoggedIn={isLoggedIn} />} />
                    <Route path="/" element={<Home isLoggedIn={isLoggedIn} actualUser={actualUser} />} />
                    <Route path="/blocked" element={<BlockedPage />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;