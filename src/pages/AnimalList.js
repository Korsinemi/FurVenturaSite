import React, { useEffect, useState, useCallback } from 'react';
import validator from 'validator';
import '../styles/AnimalList.css';
import { getApiUrl } from '../utils/apiUtils';
import { Helmet } from 'react-helmet';

function AnimalList({ role }) {
    const [animals, setAnimals] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [newAnimal, setNewAnimal] = useState({ name: '', species: '', rarity: '', class: '', imageUrl: '' });
    const [editingAnimal, setEditingAnimal] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [urlError, setUrlError] = useState('');
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
                });
        } else {
            fetchAnimals();
        }
    };

    const handleAddAnimal = () => {
        if (!validator.isURL(newAnimal.imageUrl)) {
            setUrlError('URL inválida');
            return;
        }
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newAnimal),
        })
            .then(response => response.json())
            .then(() => {
                fetchAnimals();
                setNewAnimal({ name: '', species: '', rarity: '', class: '', imageUrl: '' });
                setShowAddForm(false);
                setUrlError('');
            })
            .catch(error => console.error('Error:', error));
    };

    const handleEditAnimal = (id, updatedAnimal) => {
        if (!validator.isURL(updatedAnimal.imageUrl)) {
            setUrlError('URL inválida');
            return;
        }
        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedAnimal),
        })
            .then(response => response.json())
            .then(() => {
                fetchAnimals();
                setEditingAnimal(null);
                setUrlError('');
            })
            .catch(error => console.error('Error:', error));
    };

    const handleDeleteAnimal = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este animal?')) {
            fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(() => fetchAnimals())
                .catch(error => console.error('Error:', error));
        }
    };

    const openEditPanel = (animal) => {
        setEditingAnimal(animal);
    };

    const closeEditPanel = () => {
        setEditingAnimal(null);
    };

    return (
        <div className="animal-list">
            <Helmet>
                <title>Animalitos | FurVentura</title>
            </Helmet>
            <h2>Animalitos</h2>
            <input
                type="text"
                placeholder="Buscar por ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
            />
            <button onClick={handleSearch}>Buscar</button>
            {role === 'admin' && <button onClick={() => setShowAddForm(true)}>Agregar Nuevo Animalito</button>}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Especie</th>
                        <th>Rareza</th>
                        <th>Clase</th>
                        <th>Imagen</th>
                        {role === 'admin' && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {animals.map(animal => (
                        <tr key={animal.id}>
                            <td>{animal.id}</td>
                            <td>{animal.name}</td>
                            <td>{animal.species}</td>
                            <td>{animal.rarity}</td>
                            <td>{animal.class}</td>
                            <td>
                                <img src={animal.imageUrl} alt={animal.name} />
                                <p>{animal.imageUrl}</p>
                            </td>
                            {role === 'admin' && (
                                <td>
                                    <button onClick={() => openEditPanel(animal)}>Editar</button>
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
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={newAnimal.name}
                            onChange={(e) => setNewAnimal({ ...newAnimal, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Especie"
                            value={newAnimal.species}
                            onChange={(e) => setNewAnimal({ ...newAnimal, species: e.target.value })}
                        />
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
                        <input
                            type="text"
                            placeholder="Clase"
                            value={newAnimal.class}
                            onChange={(e) => setNewAnimal({ ...newAnimal, class: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="URL de la Imagen"
                            value={newAnimal.imageUrl}
                            onChange={(e) => setNewAnimal({ ...newAnimal, imageUrl: e.target.value })}
                        />
                        {urlError && <p className="error">{urlError}</p>}
                        <button onClick={handleAddAnimal}>Agregar</button>
                        <button onClick={() => setShowAddForm(false)}>Cancelar</button>
                    </div>
                </div>
            )}
            {editingAnimal && (
                <div className="overlay">
                    <div className="form-panel">
                        <h3>Editar Animalito</h3>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={editingAnimal.name}
                            onChange={(e) => setEditingAnimal({ ...editingAnimal, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Especie"
                            value={editingAnimal.species}
                            onChange={(e) => setEditingAnimal({ ...editingAnimal, species: e.target.value })}
                        />
                        <select
                            value={editingAnimal.rarity}
                            onChange={(e) => setEditingAnimal({ ...editingAnimal, rarity: e.target.value })}
                        >
                            <option value="Común">Común</option>
                            <option value="Raro">Raro</option>
                            <option value="Épico">Épico</option>
                            <option value="Legendario">Legendario</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Clase"
                            value={editingAnimal.class}
                            onChange={(e) => setEditingAnimal({ ...editingAnimal, class: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="URL de la Imagen"
                            value={editingAnimal.imageUrl}
                            onChange={(e) => setEditingAnimal({ ...editingAnimal, imageUrl: e.target.value })}
                        />
                        {urlError && <p className="error">{urlError}</p>}
                        <button onClick={() => handleEditAnimal(editingAnimal.id, editingAnimal)}>Guardar</button>
                        <button className="cancel" onClick={closeEditPanel}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnimalList;