import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PlayerList from './pages/PlayerList.js';
import AnimalList from './pages/AnimalList.js';
import EventPage from './pages/EventList.js'; // Importar la nueva página
import About from './pages/About.js';
import './styles/App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/assets/logo" element={'./assets/header-logo.png'} />
                    <Route path="/about" element={<About />} />
                    <Route path="/players" element={<PlayerList />} />
                    <Route path="/animals" element={<AnimalList />} />
                    <Route path="/events" element={<EventPage />} />
                    <Route path="/" element={
                        <main>
                            <h2>Bienvenido a FurVentura</h2>
                            <p>FurVentura es un emocionante juego de aventuras donde puedes explorar un mundo lleno de animales pixelados. Únete a nosotros y descubre todos los misterios que FurVentura tiene para ofrecer.</p>
                        </main>
                    } />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;