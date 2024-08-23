import React, { useEffect, useState, useCallback } from 'react';
import '../styles/PlayerList.css';

const apiUrl = process.env.NODE_ENV === 'production'
    ? 'https://fvapi.korsinemi.link/api/game'
    : 'http://localhost:5000/api/game';

function PlayerList() {
    const [players, setPlayers] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [newPlayer, setNewPlayer] = useState({ name: '', type: '', level: 1 });

    const fetchPlayers = useCallback(() => {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => setPlayers(data))
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        fetchPlayers();
    }, [fetchPlayers]);

    const handleSearch = () => {
        if (searchId) {
            fetch(`${apiUrl}/${searchId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');

                    }
                    return response.json();
                })
                .then(data => setPlayers([data]))
                .catch(error => {
                    console.error('Error:', error);
                    console.warn('La API no ha devuelto respuestas, asegúrate de que se está ejecutando localmente o en api.furventura.korsinemi.link');
                });
        } else {
            fetchPlayers();
        }
    };

    const handleAddPlayer = () => {
        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPlayer),
        })
            .then(response => response.json())
            .then(() => {
                fetchPlayers();
                setNewPlayer({ name: '', type: '', level: 1 });
            })
            .catch(error => console.error('Error:', error));
    };

    const handleEditPlayer = (id, updatedPlayer) => {
        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPlayer),
        })
            .then(response => response.json())
            .then(() => fetchPlayers())
            .catch(error => console.error('Error:', error));
    };

    const handleDeletePlayer = (id) => {
        fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        })
            .then(() => fetchPlayers())
            .catch(error => console.error('Error:', error));
    };

    return (
        <div className="player-list">
            <h2>Jugadores</h2>
            <input
                type="text"
                placeholder="Buscar por ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
            />
            <button onClick={handleSearch}>Buscar</button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Nivel</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map(player => (
                        <tr key={player.id}>
                            <td>{player.id}</td>
                            <td>{player.name}</td>
                            <td>{player.type}</td>
                            <td>{player.level}</td>
                            <td>
                                <button onClick={() => handleEditPlayer(player.id, { ...player, level: player.level + 1 })}>Editar</button>
                                <button onClick={() => handleDeletePlayer(player.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3>Agregar Nuevo Jugador</h3>
            <input
                type="text"
                placeholder="Nombre"
                value={newPlayer.name}
                onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
            />
            <input
                type="text"
                placeholder="Tipo"
                value={newPlayer.type}
                onChange={(e) => setNewPlayer({ ...newPlayer, type: e.target.value })}
            />
            <input
                type="number"
                placeholder="Nivel"
                value={newPlayer.level}
                onChange={(e) => setNewPlayer({ ...newPlayer, level: parseInt(e.target.value) })}
            />
            <button onClick={handleAddPlayer}>Agregar</button>
        </div>
    );
}

export default PlayerList;
