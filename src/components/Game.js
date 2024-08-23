import React, { useEffect, useState } from 'react';
import '../styles/Game.css';

function Game() {
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        // URL de la API
        const url = "http://localhost:5000" || "https://api.furventura.korsinemi.link"
        const apiUrl = url + '/api/game';

        // Obtener datos de la API
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => setCharacters(data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div className="game-container">
            <h2>Personajes de FurVentura</h2>
            <ul>
                {characters.map(character => (
                    <li key={character.id}>
                        {character.name} - {character.type} - Nivel {character.level}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Game;