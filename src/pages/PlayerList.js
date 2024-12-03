import React, { useEffect, useState, useCallback } from 'react';
import { getApiUrl } from '../utils/fvUtils.js';
import { Helmet } from 'react-helmet';
import '../styles/Lists.css';

const PlayerList = ({ role }) => {
    const [players, setPlayers] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [apiUrl, setApiUrl] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [messages, setMessages] = useState([]);
    const [confirmPopup, setConfirmPopup] = useState({ show: false, player: null });

    useEffect(() => {
        const fetchApiUrl = async () => {
            const url = await getApiUrl('users');
            setApiUrl(url);
        };
        fetchApiUrl();
    }, []);

    const token = localStorage.getItem('Authorization');

    const fetchPlayers = useCallback(() => {
        if (apiUrl) {
            fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => setPlayers(data))
                .catch(error => {
                    console.error('Error fetching players:', error);
                    setMessages((prev) => [...prev, { type: 'error', text: 'Error al obtener la lista de jugadores' }]);
                    setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
                });
        }
    }, [apiUrl, token]);

    useEffect(() => {
        fetchPlayers();
    }, [fetchPlayers]);

    const handleSearch = () => {
        if (searchId) {
            fetch(`${apiUrl}/${searchId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => setPlayers([data]))
                .catch(error => {
                    console.error('Error fetching player by ID:', error);
                    setMessages((prev) => [...prev, { type: 'error', text: 'Error al buscar el jugador por ID' }]);
                    setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
                });
        } else {
            setMessages((prev) => [...prev, { type: 'error', text: 'Debes ingresar un ID' }]);
            setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            fetchPlayers();
        }
    };

    const handleEditPlayer = (id, updatedPlayer) => {
        const { username = '', email = '', password = '' } = updatedPlayer;

        if (!username.trim() || !email.trim() || (password && password.length < 6)) {
            setMessages((prev) => [
                ...prev,
                ...(!username.trim() ? [{ type: 'error', text: 'El nombre de usuario no puede quedar vacío' }] : []),
                ...(!email.trim() ? [{ type: 'error', text: 'El correo electrónico no puede quedar vacío' }] : []),
                ...(password && password.length < 6 ? [{ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' }] : []),
            ]);
            setTimeout(() => setMessages((prev) => prev.slice(messages.length)), 6000);
            return;
        }

        const updates = { username, email };
        if (password) {
            updates.password = password;
        }

        fetch(`${apiUrl}/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates),
        })
            .then(response => response.json())
            .then(() => {
                fetchPlayers();
                setEditingPlayer(null);
                setConfirmPopup({ show: false, player: null });
            })
            .catch(error => {
                console.error('Error:', error);
                setMessages((prev) => [...prev, { type: 'error', text: 'Error al editar el jugador' }]);
                setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            });
    };

    const handleDeletePlayer = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este jugador?')) {
            fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(() => fetchPlayers())
                .catch(error => {
                    console.error('Error:', error);
                    setMessages((prev) => [...prev, { type: 'error', text: 'Error al eliminar el jugador' }]);
                    setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
                });
        }
    };

    const openEditPanel = (player) => {
        setConfirmPopup({ show: true, player });
    };

    const closeEditPanel = () => {
        setConfirmPopup({ show: false, player: null });
    };

    const confirmEdit = (player) => {
        setEditingPlayer(player);
        setConfirmPopup({ show: false, player: null });
        setShowEditForm(true);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="furventura-lists">
            <Helmet>
                <title>Jugadores | FurVentura</title>
            </Helmet>
            <h2>Jugadores</h2>
            <div className="search-container">
                <button
                    type="button"
                    onClick={handleSearch}
                    style={{ marginTop: '-0.5%' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <i className='fa-solid fa-magnifying-glass' />
                    </div>
                </button>
                <input
                    type="text"
                    placeholder="Ingrese el ID a buscar"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre de Usuario</th>
                        <th>Correo Electrónico</th>
                        <th>Rol</th>
                        {role === 'admin' && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {players.map(player => (
                        <tr key={player._id}>
                            <td>{player._id}</td>
                            <td>{player.username}</td>
                            <td>{player.email}</td>
                            <td>{player.role}</td>
                            {role === 'admin' && (
                                <td>
                                    <button onClick={() => openEditPanel(player)}>Editar</button>
                                    <button onClick={() => handleDeletePlayer(player._id)}>Eliminar</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {showEditForm && editingPlayer && (
                <div className="overlay">
                    <div className="form-panel">
                        <h3>Editar Jugador</h3>
                        <input
                            type="text"
                            placeholder="Nombre de Usuario"
                            value={editingPlayer.username}
                            onChange={(e) => setEditingPlayer({ ...editingPlayer, username: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Correo Electrónico"
                            value={editingPlayer.email}
                            onChange={(e) => setEditingPlayer({ ...editingPlayer, email: e.target.value })}
                        />
                        <div className="password-input">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Contraseña (dejar en blanco para no cambiar)"
                                value={editingPlayer.password || ''}
                                onChange={(e) => setEditingPlayer({ ...editingPlayer, password: e.target.value })}
                                style={{ width: 'calc(100% - 80px)', marginLeft: '10px' }}
                                autoComplete='false'
                            />
                            <button
                                type="button"
                                className="toggle-password-button"
                                onClick={toggleShowPassword}
                                style={{ top: '15%', width: '40px', height: '40px', marginRight: '0px' }}
                            >
                                {showPassword ? <i className='fa-solid fa-eye-slash' /> : <i className='fa-solid fa-eye' />}
                            </button>
                        </div>
                        <button onClick={() => handleEditPlayer(editingPlayer._id, editingPlayer)}>Guardar</button>
                        <button className="cancel" onClick={() => setShowEditForm(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            <div className="message-container">
                {messages.map((message, index) => (
                    <div key={index} className={`${message.type} message`}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p>
                                <i className={message.type === 'success' ? "fa-solid fa-circle-check" : "fa-solid fa-circle-xmark"} style={{ marginRight: '8px' }} />
                                {message.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {confirmPopup.show && (
                <div className="overlay">
                    <div className="form-panel">
                        <h3>¿Estás seguro de que deseas actualizar los datos de autenticación de {confirmPopup.player.username}? Este cambio es irreversible.</h3>
                        <button onClick={() => confirmEdit(confirmPopup.player)}>Confirmar</button>
                        <button className="cancel" onClick={closeEditPanel}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PlayerList;