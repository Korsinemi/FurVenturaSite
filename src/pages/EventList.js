import React, { useEffect, useState, useCallback } from 'react';
import validator from 'validator';
import '../styles/EventList.css';
import { getApiUrl } from '../utils/apiUtils';
import { Helmet } from 'react-helmet';

function EventList({ role }) {
    const [events, setEvents] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [newEvent, setNewEvent] = useState({ icon: '', name: '', type: '', rewards: '', participants: 0, duration: '', status: 'active' });
    const [editingEvent, setEditingEvent] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [urlError, setUrlError] = useState('');
    const [apiUrl, setApiUrl] = useState('');

    useEffect(() => {
        const fetchApiUrl = async () => {
            const url = await getApiUrl('events');
            setApiUrl(url);
        };
        fetchApiUrl();
    }, []);

    const token = localStorage.getItem('Authorization');

    const fetchEvents = useCallback(() => {
        if (apiUrl) {
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => setEvents(data))
                .catch(error => console.error('Error:', error));
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleSearch = () => {
        if (searchId) {
            fetch(`${apiUrl}/${searchId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => setEvents([data]))
                .catch(error => {
                    console.error('Error:', error);
                    console.warn('La API no ha devuelto respuestas, asegúrate de que se está ejecutando localmente o en fvapi.korsinemi.link');
                });
        } else {
            fetchEvents();
        }
    };

    const handleAddEvent = () => {
        if (!validator.isURL(newEvent.icon)) {
            setUrlError('URL inválida');
            return;
        }
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newEvent),
        })
            .then(response => response.json())
            .then(() => {
                fetchEvents();
                setNewEvent({ icon: '', name: '', type: '', rewards: '', participants: 0, duration: '', status: 'active' });
                setShowAddForm(false);
                setUrlError('');
            })
            .catch(error => console.error('Error:', error));
    };

    const handleEditEvent = (id, updatedEvent) => {
        if (!validator.isURL(updatedEvent.icon)) {
            setUrlError('URL inválida');
            return;
        }
        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedEvent),
        })
            .then(response => response.json())
            .then(() => {
                fetchEvents();
                setEditingEvent(null);
                setUrlError('');
            })
            .catch(error => console.error('Error:', error));
    };

    const handleDeleteEvent = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
            fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(() => fetchEvents())
                .catch(error => console.error('Error:', error));
        }
    };

    const openEditPanel = (event) => {
        setEditingEvent(event);
    };

    const closeEditPanel = () => {
        setEditingEvent(null);
    };

    return (
        <div className="event-list">
            <Helmet>
                <title>Eventos | FurVentura</title>
            </Helmet>
            <h2>Eventos</h2>
            <input
                type="text"
                placeholder="Buscar por ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
            />
            <button onClick={handleSearch}>Buscar</button>
            {role === 'admin' && <button onClick={() => setShowAddForm(true)}>Agregar Nuevo Evento</button>}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Icono</th>
                        <th>Nombre</th>
                        {/* <th>Tipo</th> Deprecated */}
                        <th>Recompensas</th>
                        <th>Participantes</th>
                        <th>Duración</th>
                        <th>Estado</th>
                        {role === 'admin' && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => (
                        <tr key={event.id}>
                            <td>{event.id}</td>
                            <td><img src={event.icon} alt={event.name} /></td>
                            <td>{event.name}</td>
                            {/* <td>{event.type}</td> Deprecated */}
                            <td>{event.rewards}</td>
                            <td>{event.participants}</td>
                            <td>{event.duration}</td>
                            <td>{event.status}</td>
                            {role === 'admin' && (
                                <td>
                                    <button onClick={() => openEditPanel(event)}>Editar</button>
                                    <button onClick={() => handleDeleteEvent(event.id)}>Eliminar</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {showAddForm && (
                <div className="overlay">
                    <div className="form-panel">
                        <h3>Agregar Nuevo Evento</h3>
                        <input
                            type="text"
                            placeholder="Icono"
                            value={newEvent.icon}
                            onChange={(e) => setNewEvent({ ...newEvent, icon: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={newEvent.name}
                            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                        />
                        {/*
                        <input
                            type="text"
                            placeholder="Tipo"
                            value={newEvent.type}
                            onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                        />
                        Deprecated */}
                        <input
                            type="text"
                            placeholder="Recompensas"
                            value={newEvent.rewards}
                            onChange={(e) => setNewEvent({ ...newEvent, rewards: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Participantes"
                            value={newEvent.participants}
                            onChange={(e) => setNewEvent({ ...newEvent, participants: parseInt(e.target.value) })}
                        />
                        <input
                            type="text"
                            placeholder="Duración"
                            value={newEvent.duration}
                            onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                        />
                        <select
                            value={newEvent.status}
                            onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                        >
                            <option value="active">Activo</option>
                            <option value="finished">Finalizado</option>
                        </select>
                        {urlError && <p className="error">{urlError}</p>}
                        <button onClick={handleAddEvent}>Agregar</button>
                        <button onClick={() => setShowAddForm(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {editingEvent && (
                <div className="overlay">
                    <div className="form-panel">
                        <h3>Editar Evento</h3>
                        <input
                            type="text"
                            placeholder="Icono"
                            value={editingEvent.icon}
                            onChange={(e) => setEditingEvent({ ...editingEvent, icon: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={editingEvent.name}
                            onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Tipo"
                            value={editingEvent.type}
                            onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Recompensas"
                            value={editingEvent.rewards}
                            onChange={(e) => setEditingEvent({ ...editingEvent, rewards: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Participantes"
                            value={editingEvent.participants}
                            onChange={(e) => setEditingEvent({ ...editingEvent, participants: parseInt(e.target.value) })}
                        />
                        <input
                            type="text"
                            placeholder="Duración"
                            value={editingEvent.duration}
                            onChange={(e) => setEditingEvent({ ...editingEvent, duration: e.target.value })}
                        />
                        <select
                            value={editingEvent.status}
                            onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
                        >
                            <option value="active">Activo</option>
                            <option value="finished">Finalizado</option>
                        </select>
                        {urlError && <p className="error">{urlError}</p>}
                        <button onClick={() => handleEditEvent(editingEvent.id, editingEvent)}>Guardar</button>
                        <button className="cancel" onClick={closeEditPanel}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EventList;
