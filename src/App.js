import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PlayerList from './components/PlayerList';
import './styles/App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/about" element={<div>Sobre Nosotros</div>} />
                    <Route path="/players" element={<PlayerList />} />
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
