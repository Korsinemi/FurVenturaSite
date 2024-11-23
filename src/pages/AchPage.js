import React, { useEffect, useState, useCallback } from 'react';
import validator from 'validator';
import '../styles/AchList.css';
import { getApiUrl } from '../utils/apiUtils';
import { Helmet } from 'react-helmet';

function AchievementList({ role }) {
    const [achievements, setAchievements] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [newAchievement, setNewAchievement] = useState({ icon: '', name: '', description: '', points: 0 });
    const [editingAchievement, setEditingAchievement] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [urlError, setUrlError] = useState('');
    const [apiUrl, setApiUrl] = useState('');

    useEffect(() => {
        const fetchApiUrl = async () => {
            const url = await getApiUrl('achievements');
            setApiUrl(url);
        };
        fetchApiUrl();
    }, []);

    const token = localStorage.getItem('Authorization');

    const fetchAchievements = useCallback(() => {
        if (apiUrl) {
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => setAchievements(data))
                .catch(error => console.error('Error:', error));
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchAchievements();
    }, [fetchAchievements]);

    const handleSearch = () => {
        if (searchId) {
            fetch(`${apiUrl}/${searchId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => setAchievements([data]))
                .catch(error => {
                    console.error('Error:', error);
                    console.warn('La API no ha devuelto respuestas, asegúrate de que se está ejecutando localmente o en fvapi.korsinemi.link');
                });
        } else {
            fetchAchievements();
        }
    };

    const handleAddAchievement = () => {
        if (!validator.isURL(newAchievement.icon)) {
            setUrlError('URL inválida');
            return;
        }
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newAchievement),
        })
            .then(response => response.json())
            .then(() => {
                fetchAchievements();
                setNewAchievement({ icon: '', name: '', description: '', points: 0 });
                setShowAddForm(false);
                setUrlError('');
            })
            .catch(error => console.error('Error:', error));
    };

    const handleEditAchievement = (id, updatedAchievement) => {
        if (!validator.isURL(updatedAchievement.icon)) {
            setUrlError('URL inválida');
            return;
        }
        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedAchievement),
        })
            .then(response => response.json())
            .then(() => {
                fetchAchievements();
                setEditingAchievement(null);
                setUrlError('');
            })
            .catch(error => console.error('Error:', error));
    };

    const handleDeleteAchievement = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este logro?')) {
            fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(() => fetchAchievements())
                .catch(error => console.error('Error:', error));
        }
    };

    const openEditPanel = (achievement) => {
        setEditingAchievement(achievement);
    };

    const closeEditPanel = () => {
        setEditingAchievement(null);
    };

    return (
        <div className="achievement-list">
            <Helmet>
                <title>Logros | FurVentura</title>
            </Helmet>
            <h2>Logros</h2>
            <input
                type="text"
                placeholder="Buscar por ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
            />
            <button onClick={handleSearch}>Buscar</button>
            {role === 'admin' && <button onClick={() => setShowAddForm(true)}>Agregar Nuevo Logro</button>}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Icono</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Puntos</th>
                        {role === 'admin' && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {achievements.map(achievement => (
                        <tr key={achievement.id}>
                            <td>{achievement.id}</td>
                            <td><img src={achievement.icon} alt={achievement.title} /></td>
                            <td>{achievement.title}</td>
                            <td>{achievement.description}</td>
                            <td>{achievement.points}</td>
                            {role === 'admin' && (
                                <td>
                                    <button onClick={() => openEditPanel(achievement)}>Editar</button>
                                    <button onClick={() => handleDeleteAchievement(achievement.id)}>Eliminar</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {showAddForm && (
                <div className="overlay">
                    <div className="form-panel">
                        <h3>Agregar Nuevo Logro</h3>
                        <input
                            type="text"
                            placeholder="Icono (URL)"
                            value={newAchievement.icon}
                            onChange={(e) => setNewAchievement({ ...newAchievement, icon: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={newAchievement.title}
                            onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Descripción"
                            value={newAchievement.description}
                            onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Puntos"
                            value={newAchievement.points}
                            onChange={(e) => setNewAchievement({ ...newAchievement, points: parseInt(e.target.value) })}
                        />
                        {urlError && <p className="error">{urlError}</p>}
                        <button onClick={handleAddAchievement}>Agregar</button>
                        <button onClick={() => setShowAddForm(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {editingAchievement && (
                <div className="overlay">
                    <div className="form-panel">
                        <h3>Editar Logro</h3>
                        <input
                            type="text"
                            placeholder="Icono (URL)"
                            value={editingAchievement.icon}
                            onChange={(e) => setEditingAchievement({ ...editingAchievement, icon: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={editingAchievement.title}
                            onChange={(e) => setEditingAchievement({ ...editingAchievement, title: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Descripción"
                            value={editingAchievement.description}
                            onChange={(e) => setEditingAchievement({ ...editingAchievement, description: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Puntos"
                            value={editingAchievement.points}
                            onChange={(e) => setEditingAchievement({ ...editingAchievement, points: parseInt(e.target.value) })}
                        />
                        {urlError && <p className="error">{urlError}</p>}
                        <button onClick={() => handleEditAchievement(editingAchievement.id, editingAchievement)}>Guardar</button>
                        <button className="cancel" onClick={closeEditPanel}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AchievementList;