import React, { useEffect, useState, useCallback } from 'react';
import { getApiUrl, validateForm } from '../utils/fvUtils.js';
import { fileUpload, deleteImage } from '../utils/imagekitUtils.js';
import { Helmet } from 'react-helmet';
import '../styles/Lists.css';

const AnimalList = ({ role }) => {
    const [animals, setAnimals] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [newAnimal, setNewAnimal] = useState({ name: '', species: '', rarity: '', class: '', imageUrl: '' });
    const [iconFile, setIconFile] = useState(null);
    const [editingAnimal, setEditingAnimal] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [messages, setMessages] = useState([]);
    const [apiUrl, setApiUrl] = useState('');

    useEffect(() => {
        const fetchApiUrl = async () => {
            const url = await getApiUrl('animals');
            setApiUrl(url);
        };
        fetchApiUrl();
    }, []);

    const token = localStorage.getItem('Authorization');

    const fetchAnimals = useCallback(() => {
        if (apiUrl) {
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => setAnimals(data))
                .catch(error => console.error('Error:', error));
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchAnimals();
    }, [fetchAnimals]);

    const handleSearch = () => {
        if (searchId) {
            fetch(`${apiUrl}/${searchId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => setAnimals([data]))
                .catch(error => {
                    console.error('Error:', error);
                    console.warn('La API no ha devuelto respuestas, asegúrate de que se está ejecutando localmente o en fvapi.korsinemi.link');
                    setMessages((prev) => [...prev, { type: 'error', text: 'Error al buscar el animalito' }]);
                    setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
                });
        } else {
            fetchAnimals();
        }
    };

    const handleAddAnimal = async () => {
        if (!validateForm(newAnimal, iconFile, setMessages, false, 'animal')) {
            return;
        }

        const iconUrl = await fileUpload(iconFile, setMessages);
        if (!iconUrl) return;

        const newAnimalWithIcon = { ...newAnimal, imageUrl: iconUrl };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newAnimalWithIcon),
        })
            .then(response => response.json())
            .then((addedAnimal) => {
                fetchAnimals();
                setNewAnimal({ name: '', species: '', rarity: '', class: '', imageUrl: '' });
                setIconFile(null);
                setShowAddForm(false);
                setMessages((prev) => [...prev, { type: 'success', text: `Se agregó ${addedAnimal.name} (ID: ${addedAnimal.id}) satisfactoriamente` }]);
                setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            })
            .catch(error => {
                console.error('Error:', error);
                setMessages((prev) => [...prev, { type: 'error', text: 'Error al agregar el animalito' }]);
                setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            });
    };

    const handleEditAnimal = async (id, updatedAnimal) => {
        if (!validateForm(updatedAnimal, iconFile, setMessages, true, 'animal')) {
            return;
        }

        let iconUrl = updatedAnimal.imageUrl;

        if (iconFile) {
            await deleteImage(iconUrl, setMessages);
            iconUrl = await fileUpload(iconFile, setMessages);
            if (!iconUrl) return;
        }

        const updatedAnimalWithIcon = { ...updatedAnimal, imageUrl: iconUrl };

        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedAnimalWithIcon),
        })
            .then(response => response.json())
            .then((updatedAnimal) => {
                fetchAnimals();
                setEditingAnimal(null);
                setIconFile(null);
                setMessages((prev) => [...prev, { type: 'success', text: `Se actualizó ${updatedAnimal.name} (ID: ${updatedAnimal.id}) satisfactoriamente` }]);
                setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            })
            .catch(error => {
                console.error('Error:', error);
                setMessages((prev) => [...prev, { type: 'error', text: 'Error al editar el animalito' }]);
                setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            });
    };

    const handleDeleteAnimal = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este animal?')) {
            const animal = animals.find(a => a.id === id);
            if (animal && animal.imageUrl) {
                deleteImage(animal.imageUrl, setMessages);
            }
            fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(() => {
                    fetchAnimals();
                    setMessages((prev) => [...prev, { type: 'success', text: `Se eliminó ${animal.name} (ID: ${animal.id}) satisfactoriamente` }]);
                    setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
                })
                .catch(error => {
                    console.error('Error:', error);
                    setMessages((prev) => [...prev, { type: 'error', text: 'Error al eliminar el animalito' }]);
                    setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
                });
        }
    };

    return (
        <div className="furventura-lists">
            <Helmet>
                <title>Animalitos | FurVentura</title>
            </Helmet>
            <h2>Animalitos</h2>
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
            {role === 'admin' && <button onClick={() => setShowAddForm(true)}>Agregar Nuevo Animalito</button>}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Especie</th>
                        <th>Rareza</th>
                        <th>Clase</th>
                        {role === 'admin' && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {animals.map(animal => (
                        <tr key={animal.id}>
                            <td>{animal.id}</td>
                            <td>
                                <img src={animal.imageUrl} alt={animal.name} />
                            </td>
                            <td>{animal.name}</td>
                            <td>{animal.species}</td>
                            <td>{animal.rarity}</td>
                            <td>{animal.class}</td>
                            {role === 'admin' && (
                                <td>
                                    <button onClick={() => setEditingAnimal(animal)}>Editar</button>
                                    <button onClick={() => handleDeleteAnimal(animal.id)}>Eliminar</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {showAddForm && (
                <div className="overlay">
                    <div className="form-panel">
                        <h3>Agregar Nuevo Animalito</h3>
                        <label>Icono:</label>
                        <input
                            type="file"
                            onChange={(e) => setIconFile(e.target.files[0])}
                        />
                        <label>Nombre:</label>
                        <input
                            type="text"
                            placeholder="Ingrese el nombre del animalito"
                            value={newAnimal.name}
                            onChange={(e) => setNewAnimal({ ...newAnimal, name: e.target.value })}
                        />
                        <label>Especie:</label>
                        <input
                            type="text"
                            placeholder="Ingrese nombre de la especie (mamífero, reptil, etc...)"
                            value={newAnimal.species}
                            onChange={(e) => setNewAnimal({ ...newAnimal, species: e.target.value })}
                        />
                        <label>Rareza:</label>
                        <select
                            value={newAnimal.rarity}
                            onChange={(e) => setNewAnimal({ ...newAnimal, rarity: e.target.value })}
                        >
                            <option value="">Selecciona Rareza</option>
                            <option value="Común">Común</option>
                            <option value="Raro">Raro</option>
                            <option value="Épico">Épico</option>
                            <option value="Legendario">Legendario</option>
                        </select>
                        <label>Clase:</label>
                        <input
                            type="text"
                            placeholder="Ingrese la clase (zorro, perro, gato, etc...)"
                            value={newAnimal.class}
                            onChange={(e) => setNewAnimal({ ...newAnimal, class: e.target.value })}
                        />
                        <button onClick={handleAddAnimal}>Agregar</button>
                        <button className="cancel" onClick={() => setShowAddForm(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {editingAnimal && (
                <div className="overlay">
                    <div className="form-panel">
                        <h3>Editar Animalito</h3>
                        <label>Icono:</label>
                        <input
                            type="file"
                            onChange={(e) => setIconFile(e.target.files[0])}
                        />
                        <label>Nombre:</label>
                        <input
                            type="text"
                            placeholder="Ingrese el nombre del animalito"
                            value={editingAnimal.name}
                            onChange={(e) => setEditingAnimal({ ...editingAnimal, name: e.target.value })}
                        />
                        <label>Especie:</label>
                        <input
                            type="text"
                            placeholder="Ingrese nombre de la especie (mamífero, reptil, etc...)"
                            value={editingAnimal.species}
                            onChange={(e) => setEditingAnimal({ ...editingAnimal, species: e.target.value })}
                        />
                        <label>Rareza:</label>
                        <select
                            value={editingAnimal.rarity}
                            onChange={(e) => setEditingAnimal({ ...editingAnimal, rarity: e.target.value })}
                        >
                            <option value="">Selecciona Rareza</option>
                            <option value="Común">Común</option>
                            <option value="Raro">Raro</option>
                            <option value="Épico">Épico</option>
                            <option value="Legendario">Legendario</option>
                        </select>
                        <label>Clase:</label>
                        <input
                            type="text"
                            placeholder="Ingrese la clase (zorro, perro, gato, etc...)"
                            value={editingAnimal.class}
                            onChange={(e) => setEditingAnimal({ ...editingAnimal, class: e.target.value })}
                        />
                        <button onClick={() => handleEditAnimal(editingAnimal.id, editingAnimal)}>Guardar</button>
                        <button className="cancel" onClick={() => setEditingAnimal(null)}>Cancelar</button>
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
};

export default AnimalList;