import React, { useEffect, useState, useCallback } from 'react';
import { getApiUrl, validateForm } from '../utils/fvUtils.js';
import { fileUpload, deleteImage } from '../utils/imagekitUtils.js';
import { Helmet } from 'react-helmet';
import '../styles/Lists.css';

const AchievementList = ({ role }) => {
    const [achievements, setAchievements] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [newAchievement, setNewAchievement] = useState({ name: '', description: '', points: 0, icon: '' });
    const [iconFile, setIconFile] = useState(null);
    const [editingAchievement, setEditingAchievement] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [messages, setMessages] = useState([]);
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
                    setMessages((prev) => [...prev, { type: 'error', text: 'Error al buscar el logro' }]);
                    setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
                });
        } else {
            fetchAchievements();
        }
    };

    const handleAddAchievement = async () => {
        if (!validateForm(newAchievement, iconFile, setMessages, false, 'achievement')) {
            return;
        }

        const iconUrl = await fileUpload(iconFile, setMessages);
        if (!iconUrl) return;

        const newAchievementWithIcon = { ...newAchievement, icon: iconUrl };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newAchievementWithIcon),
        })
            .then(response => response.json())
            .then((addedAchievement) => {
                fetchAchievements();
                setNewAchievement({ name: '', description: '', points: 0, icon: '' });
                setIconFile(null);
                setShowAddForm(false);
                setMessages((prev) => [...prev, { type: 'success', text: `Se agregó ${addedAchievement.name} (ID: ${addedAchievement.id}) satisfactoriamente` }]);
                setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            })
            .catch(error => {
                console.error('Error:', error);
                setMessages((prev) => [...prev, { type: 'error', text: 'Error al agregar el logro' }]);
                setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            });
    };

    const handleEditAchievement = async (id, updatedAchievement) => {
        if (!validateForm(updatedAchievement, iconFile, setMessages, true, 'achievement')) {
            return;
        }

        let iconUrl = updatedAchievement.icon;

        if (iconFile) {
            await deleteImage(iconUrl, setMessages);
            iconUrl = await fileUpload(iconFile, setMessages);
            if (!iconUrl) return;
        }

        const updatedAchievementWithIcon = { ...updatedAchievement, icon: iconUrl };

        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedAchievementWithIcon),
        })
            .then(response => response.json())
            .then((updatedAchievement) => {
                fetchAchievements();
                setEditingAchievement(null);
                setIconFile(null);
                setMessages((prev) => [...prev, { type: 'success', text: `Se actualizó ${updatedAchievement.name} (ID: ${updatedAchievement.id}) satisfactoriamente` }]);
                setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            })
            .catch(error => {
                console.error('Error:', error);
                setMessages((prev) => [...prev, { type: 'error', text: 'Error al editar el logro' }]);
                setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            });
    };

    const handleDeleteAchievement = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este logro?')) {
            const achievement = achievements.find(a => a.id === id);
            if (achievement && achievement.icon) {
                deleteImage(achievement.icon, setMessages);
            }
            fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(() => {
                    fetchAchievements();
                    setMessages((prev) => [...prev, { type: 'success', text: `Se eliminó ${achievement.name} (ID: ${achievement.id}) satisfactoriamente` }]);
                    setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
                })
                .catch(error => {
                    console.error('Error:', error);
                    setMessages((prev) => [...prev, { type: 'error', text: 'Error al eliminar el logro' }]);
                    setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
                });
        }
    };

    return (
        <div className="furventura-lists">
            <Helmet>
                <title>Logros | FurVentura</title>
            </Helmet>
            <h2>Logros</h2>
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
                            <td><img src={achievement.icon} alt={achievement.name} /></td>
                            <td>{achievement.name}</td>
                            <td>{achievement.description}</td>
                            <td>{achievement.points}</td>
                            {role === 'admin' && (
                                <td>
                                    <button onClick={() => setEditingAchievement(achievement)}>Editar</button>
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
                        <label>Icono:</label>
                        <input
                            type="file"
                            onChange={(e) => setIconFile(e.target.files[0])}
                        />
                        <label>Nombre:</label>
                        <input
                            type="text"
                            placeholder="Ingrese el nombre del logro"
                            value={newAchievement.name}
                            onChange={(e) => setNewAchievement({ ...newAchievement, name: e.target.value })}
                        />
                        <label>Descripción:</label>
                        <input
                            type="text"
                            placeholder="Ingrese una descripcion del logro"
                            value={newAchievement.description}
                            onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                        />
                        <label>Puntos:</label>
                        <input
                            type="number"
                            placeholder="Puntos"
                            value={newAchievement.points}
                            onChange={(e) => setNewAchievement({ ...newAchievement, points: parseInt(e.target.value) })}
                        />
                        <button onClick={handleAddAchievement}>Agregar</button>
                        <button className="cancel" onClick={() => setShowAddForm(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {editingAchievement && (
                <div className="overlay">
                    <div className="form-panel">
                        <h3>Editar Logro</h3>
                        <label>Icono:</label>
                        <input
                            type="file"
                            onChange={(e) => setIconFile(e.target.files[0])}
                        />
                        <label>Nombre:</label>
                        <input
                            type="text"
                            placeholder="Ingrese el nombre del logro"
                            value={editingAchievement.name}
                            onChange={(e) => setEditingAchievement({ ...editingAchievement, name: e.target.value })}
                        />
                        <label>Descripción:</label>
                        <input
                            type="text"
                            placeholder="Ingrese una descripcion del logro"
                            value={editingAchievement.description}
                            onChange={(e) => setEditingAchievement({ ...editingAchievement, description: e.target.value })}
                        />
                        <label>Puntos:</label>
                        <input
                            type="number"
                            placeholder="Puntos"
                            value={editingAchievement.points}
                            onChange={(e) => setEditingAchievement({ ...editingAchievement, points: parseInt(e.target.value) })}
                        />
                        <button onClick={() => handleEditAchievement(editingAchievement.id, editingAchievement)}>Guardar</button>
                        <button className="cancel" onClick={() => setEditingAchievement(null)}>Cancelar</button>
                    </div>
                </div>
            )}

            <div className="message-container">
                {messages.map((message, index) => (
                    <div key={index} className={`${message.type} message`}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p>
                                <i className={message.type === 'success' ? "fa-solid fa-octagon-check" : "fa-solid fa-octagon-xmark"} style={{ marginRight: '8px' }} />
                                {message.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AchievementList;
