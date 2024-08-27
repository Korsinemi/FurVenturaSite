import React, { useEffect, useState, useCallback } from 'react';
import '../styles/PlayerList.css';
import { getApiUrl } from '../utils/apiUtils';

function PlayerList() {
    const [players, setPlayers] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [newPlayer, setNewPlayer] = useState({ name: '', type: '', level: 1 });
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [urlError, setUrlError] = useState('');
    const [apiUrl, setApiUrl] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchApiUrl = async () => {
            const url = await getApiUrl('game');
            setApiUrl(url);
        };
        fetchApiUrl();
    }, []);

    const fetchPlayers = useCallback(() => {
        if (apiUrl) {
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => setPlayers(data))
                .catch(error => console.error('Error:', error));
        }
    }, [apiUrl]);

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
                    console.warn('La API no ha devuelto respuestas, asegúrate de que se está ejecutando localmente o en fvapi.korsinemi.link');
                });
        } else {
            setError('Debes poner una ID');
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
                setShowAddForm(false);
                setUrlError('');
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
            .then(() => {
                fetchPlayers();
                setEditingPlayer(null);
                setUrlError('');
            })
            .catch(error => console.error('Error:', error));
    };

    const handleDeletePlayer = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este jugador?')) {
            fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
            })
                .then(() => fetchPlayers())
                .catch(error => console.error('Error:', error));
        }
    };

    const openEditPanel = (player) => {
        setEditingPlayer(player);
    };

    const closeEditPanel = () => {
        setEditingPlayer(null);
    };

    return (
        <div className="player-list">
            <h2>Jugadores</h2>
            <div className="search-container">
                <button onClick={handleSearch}>Buscar</button>
                <input
                    type="text"
                    placeholder="Buscar por ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button onClick={() => setShowAddForm(true)}>Agregar Nuevo Jugador</button>
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
                                <button onClick={() => openEditPanel(player)}>Editar</button>
                                <button onClick={() => handleDeletePlayer(player.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showAddForm && (
                <div className="overlay">
                    <div className="form-panel">
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
                        {urlError && <p className="error">{urlError}</p>}
                        <button onClick={handleAddPlayer}>Agregar</button>
                        <button onClick={() => setShowAddForm(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {editingPlayer && (
                <div className="overlay">
                    <div className="form-panel">
                        <h3>Editar Jugador</h3>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={editingPlayer.name}
                            onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Tipo"
                            value={editingPlayer.type}
                            onChange={(e) => setEditingPlayer({ ...editingPlayer, type: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Nivel"
                            value={editingPlayer.level}
                            onChange={(e) => setEditingPlayer({ ...editingPlayer, level: parseInt(e.target.value) })}
                        />
                        {urlError && <p className="error">{urlError}</p>}
                        <button onClick={() => handleEditPlayer(editingPlayer.id, editingPlayer)}>Guardar</button>
                        <button className="cancel" onClick={closeEditPanel}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PlayerList;