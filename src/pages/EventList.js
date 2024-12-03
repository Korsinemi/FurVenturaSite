import React, { useEffect, useState, useCallback } from 'react';
import { getApiUrl, validateForm } from '../utils/fvUtils.js';
import { fileUpload, deleteImage } from '../utils/imagekitUtils.js';
import { Helmet } from 'react-helmet';
import '../styles/Lists.css';

const EventList = ({ role }) => {
    const [events, setEvents] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [newEvent, setNewEvent] = useState({ icon: '', name: '', type: '', rewards: '', participants: 0, duration: '', status: 'active' });
    const [iconFile, setIconFile] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [messages, setMessages] = useState([]);
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
                    setMessages((prev) => [...prev, { type: 'error', text: 'Error al buscar el evento' }]);
                    setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
                });
        } else {
            fetchEvents();
        }
    };

    const handleAddEvent = async () => {
        if (!validateForm(newEvent, iconFile, setMessages, false, 'event')) {
            return;
        }

        const iconUrl = await fileUpload(iconFile, setMessages);
        if (!iconUrl) return;

        const newEventWithIcon = { ...newEvent, icon: iconUrl };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newEventWithIcon),
        })
            .then(response => response.json())
            .then((addedEvent) => {
                fetchEvents();
                setNewEvent({ icon: '', name: '', type: '', rewards: '', participants: 0, duration: '', status: 'active' });
                setIconFile(null);
                setShowAddForm(false);
                setMessages((prev) => [...prev, { type: 'success', text: `Se agregó ${addedEvent.name} (ID: ${addedEvent.id}) satisfactoriamente` }]);
                setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            })
            .catch(error => {
                console.error('Error:', error);
                setMessages((prev) => [...prev, { type: 'error', text: 'Error al agregar el evento' }]);
                setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            });
    };

    const handleEditEvent = async (id, updatedEvent) => {
        if (!validateForm(updateEvent, iconFile, setMessages, false, 'event')) {
            return;
        }

        let iconUrl = updatedEvent.icon;

        if (iconFile) {
            await deleteImage(iconUrl, setMessages);
            iconUrl = await fileUpload(iconFile, setMessages);
            if (!iconUrl) return;
        }

        const updatedEventWithIcon = { ...updatedEvent, icon: iconUrl };

        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedEventWithIcon),
        })
            .then(response => response.json())
            .then((updatedEvent) => {
                fetchEvents();
                setEditingEvent(null);
                setIconFile(null);
                setMessages((prev) => [...prev, { type: 'success', text: `Se actualizó ${updatedEvent.name} (ID: ${updatedEvent.id}) satisfactoriamente` }]);
                setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            })
            .catch(error => {
                console.error('Error:', error);
                setMessages((prev) => [...prev, { type: 'error', text: 'Error al editar el evento' }]);
                setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            });
    };

    const handleDeleteEvent = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
            const event = events.find(e => e.id === id);
            if (event && event.icon) {
                deleteImage(event.icon, setMessages);
            }
            fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(() => {
                    fetchEvents();
                    setMessages((prev) => [...prev, { type: 'success', text: `Se eliminó ${event.name} (ID: ${event.id}) satisfactoriamente` }]);
                    setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
                })
                .catch(error => {
                    console.error('Error:', error);
                    setMessages((prev) => [...prev, { type: 'error', text: 'Error al eliminar el evento' }]);
                    setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
                });
        }
    };

    return (
        <div className="furventura-lists">
            <Helmet>
                <title>Eventos | FurVentura</title>
            </Helmet>
            <h2>Eventos</h2>
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
            {role === 'admin' && <button onClick={() => setShowAddForm(true)}>Agregar Nuevo Evento</button>}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Icono</th>
                        <th>Nombre</th>
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
                            <td>{event.rewards}</td>
                            <td>{event.participants}</td>
                            <td>{event.duration}</td>
                            <td>{event.status}</td>
                            {role === 'admin' && (
                                <td>
                                    <button onClick={() => setEditingEvent(event)}>Editar</button>
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
                        <label>Icono:</label>
                        <input
                            type="file"
                            onChange={(e) => setIconFile(e.target.files[0])}
                        />
                        <label>Nombre:</label>
                        <input
                            type="text"
                            placeholder="Ingrese el nombre del evento"
                            value={newEvent.name}
                            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                        />
                        <label>Recompensas:</label>
                        <input
                            type="text"
                            placeholder="Ingrese las recompensas del evento"
                            value={newEvent.rewards}
                            onChange={(e) => setNewEvent({ ...newEvent, rewards: e.target.value })}
                        />
                        <label>Participantes:</label>
                        <input
                            type="number"
                            placeholder="Participantes"
                            value={newEvent.participants}
                            onChange={(e) => setNewEvent({ ...newEvent, participants: parseInt(e.target.value) })}
                        />
                        <label>Duración:</label>
                        <input
                            type="text"
                            placeholder="Ingrese la duración"
                            value={newEvent.duration}
                            onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                        />
                        <label>Estado:</label>
                        <select
                            value={newEvent.status}
                            onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                        >
                            <option value="active">Activo</option>
                            <option value="finished">Finalizado</option>
                        </select>
                        <button onClick={handleAddEvent}>Agregar</button>
                        <button className="cancel" onClick={() => setShowAddForm(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {editingEvent && (
                <div className="overlay">
                    <div className="form-panel">
                        <h3>Editar Evento</h3>
                        <label>Icono:</label>
                        <input
                            type="file"
                            onChange={(e) => setIconFile(e.target.files[0])}
                        />
                        <label>Nombre:</label>
                        <input
                            type="text"
                            placeholder="Ingrese el nombre del evento"
                            value={editingEvent.name}
                            onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                        />
                        <label>Recompensas:</label>
                        <input
                            type="text"
                            placeholder="Ingrese las recompensas del evento"
                            value={editingEvent.rewards}
                            onChange={(e) => setEditingEvent({ ...editingEvent, rewards: e.target.value })}
                        />
                        <label>Participantes:</label>
                        <input
                            type="number"
                            placeholder="Participantes"
                            value={editingEvent.participants}
                            onChange={(e) => setEditingEvent({ ...editingEvent, participants: parseInt(e.target.value) })}
                        />
                        <label>Duración:</label>
                        <input
                            type="text"
                            placeholder="Ingrese la duración"
                            value={editingEvent.duration}
                            onChange={(e) => setEditingEvent({ ...editingEvent, duration: e.target.value })}
                        />
                        <label>Estado:</label>
                        <select
                            value={editingEvent.status}
                            onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
                        >
                            <option value="active">Activo</option>
                            <option value="finished">Finalizado</option>
                        </select>
                        <button onClick={() => handleEditEvent(editingEvent.id, editingEvent)}>Guardar</button>
                        <button className="cancel" onClick={() => setEditingEvent(null)}>Cancelar</button>
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

export default EventList;