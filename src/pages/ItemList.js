import React, { useEffect, useState, useCallback } from 'react';
import validator from 'validator';
import '../styles/ItemList.css';
import { getApiUrl } from '../utils/apiUtils';
import { Helmet } from 'react-helmet';

function ItemList({ role }) {
    const [items, setItems] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [newItem, setNewItem] = useState({ name: '', rarity: '', type: '', description: '', icon: '', uses: 0, obtetionMethod: '', isTradeable: false, isLimited: false, limitedCopies: 0 });
    const [editingItem, setEditingItem] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [urlError, setUrlError] = useState('');
    const [apiUrl, setApiUrl] = useState('');

    useEffect(() => {
        const fetchApiUrl = async () => {
            const url = await getApiUrl('items');
            setApiUrl(url);
        };
        fetchApiUrl();
    }, []);

    const token = localStorage.getItem('Authorization');

    const fetchItems = useCallback(() => {
        if (apiUrl) {
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => setItems(data))
                .catch(error => console.error('Error:', error));
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleSearch = () => {
        if (searchId) {
            fetch(`${apiUrl}/${searchId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => setItems([data]))
                .catch(error => {
                    console.error('Error:', error);
                    console.warn('La API no ha devuelto respuestas, asegúrate de que se está ejecutando localmente o en fvapi.korsinemi.link');
                });
        } else {
            fetchItems();
        }
    };

    const handleAddItem = () => {
        if (!validator.isURL(newItem.icon)) {
            setUrlError('URL inválida');
            return;
        }
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newItem),
        })
            .then(response => response.json())
            .then(() => {
                fetchItems();
                setNewItem({ name: '', rarity: '', type: '', description: '', icon: '', uses: 0, obtetionMethod: '', isTradeable: false, isLimited: false, limitedCopies: 0 });
                setShowAddForm(false);
                setUrlError('');
            })
            .catch(error => console.error('Error:', error));
    };

    const handleEditItem = (id, updatedItem) => {
        if (!validator.isURL(updatedItem.icon)) {
            setUrlError('URL inválida');
            return;
        }
        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedItem),
        })
            .then(response => response.json())
            .then(() => {
                fetchItems();
                setEditingItem(null);
                setUrlError('');
            })
            .catch(error => console.error('Error:', error));
    };

    const handleDeleteItem = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
            fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(() => fetchItems())
                .catch(error => console.error('Error:', error));
        }
    };

    const openEditPanel = (item) => {
        setEditingItem(item);
    };

    const closeEditPanel = () => {
        setEditingItem(null);
    };

    return (
        <div className="item-list">
            <Helmet>
                <title>Items | FurVentura</title>
            </Helmet>
            <h2>Items</h2>
            <input
                type="text"
                placeholder="Buscar por ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
            />
            <button onClick={handleSearch}>Buscar</button>
            {role === 'admin' && <button onClick={() => setShowAddForm(true)}>Agregar Nuevo Item</button>}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Icono</th>
                        <th>Nombre</th>
                        <th>Rareza</th>
                        <th>Tipo</th>
                        <th>Descripción</th>
                        <th>Usos</th>
                        <th>Método de Obtención</th>
                        <th>Intercambiable</th>
                        <th>Limitado</th>
                        {role === 'admin' && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td><img src={item.icon} alt={item.name} /></td>
                            <td>{item.name}</td>
                            <td>{item.rarity}</td>
                            <td>{item.type}</td>
                            <td>{item.description}</td>
                            <td>{item.uses}</td>
                            <td>{item.obtetionMethod}</td>
                            <td>{item.isTradeable ? 'Sí' : 'No'}</td>
                            <td>{item.isLimited ? `Sí, ${item.limitedCopies} copias` : 'No'}</td>
                            {role === 'admin' && (
                                <td>
                                    <button onClick={() => openEditPanel(item)}>Editar</button>
                                    <button onClick={() => handleDeleteItem(item.id)}>Eliminar</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {showAddForm && (
                <div className="overlay">
                    <div className="form-panel">
                        <h3>Agregar Nuevo Item</h3>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Rareza"
                            value={newItem.rarity}
                            onChange={(e) => setNewItem({ ...newItem, rarity: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Tipo"
                            value={newItem.type}
                            onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Descripción"
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Icono (URL)"
                            value={newItem.icon}
                            onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Usos"
                            value={newItem.uses}
                            onChange={(e) => setNewItem({ ...newItem, uses: parseInt(e.target.value) })}
                        />
                        <select
                            placeholder="Método de Obtención"
                            value={newItem.obtetionMethod}
                            onChange={(e) => setNewItem({ ...newItem, obtetionMethod: e.target.value })}
                        >
                            <option value="">Selecciona Método de Obtención</option>
                            <option value="redeemable">Canjeable</option>
                            <option value="exclusive">Exclusivo</option>
                            <option value="event">Evento</option>
                            <option value="bonus">Bonificación</option>
                            <option value="admin">Admin</option>
                            <option value="shop">Tienda</option>
                            <option value="quest">Misión</option>
                        </select>

                        <label>
                            Intercambiable:
                            <input
                                type="checkbox"
                                checked={newItem.isTradeable}
                                onChange={(e) => setNewItem({ ...newItem, isTradeable: e.target.checked })}
                            />
                        </label>
                        <label>
                            Limitado:
                            <input
                                type="checkbox"
                                checked={newItem.isLimited}
                                onChange={(e) => setNewItem({ ...newItem, isLimited: e.target.checked })}
                            />
                        </label>
                        {newItem.isLimited && (
                            <input
                                type="number"
                                placeholder="Copias Limitadas"
                                value={newItem.limitedCopies}
                                onChange={(e) => setNewItem({ ...newItem, limitedCopies: parseInt(e.target.value) })}
                            />
                        )}
                        {urlError && <p className="error">{urlError}</p>}
                        <button onClick={handleAddItem}>Agregar</button>
                        <button onClick={() => setShowAddForm(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {editingItem && (
                <div className="overlay">
                    <div className="form-panel">
                        <h3>Editar Item</h3>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={editingItem.name}
                            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Rareza"
                            value={editingItem.rarity}
                            onChange={(e) => setEditingItem({ ...editingItem, rarity: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Tipo"
                            value={editingItem.type}
                            onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Descripción"
                            value={editingItem.description}
                            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Icono (URL)"
                            value={editingItem.icon}
                            onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Usos"
                            value={editingItem.uses}
                            onChange={(e) => setEditingItem({ ...editingItem, uses: parseInt(e.target.value) })}
                        />
                        <select
                            placeholder="Método de Obtención"
                            value={editingItem.obtetionMethod}
                            onChange={(e) => setEditingItem({ ...editingItem, obtetionMethod: e.target.value })}
                        >
                            <option value="">Selecciona Método de Obtención</option>
                            <option value="redeemable">Canjeable</option>
                            <option value="exclusive">Exclusivo</option>
                            <option value="event">Evento</option>
                            <option value="bonus">Bonificación</option>
                            <option value="admin">Admin</option>
                            <option value="shop">Tienda</option>
                            <option value="quest">Misión</option>
                        </select>

                        <label>
                            Intercambiable:
                            <input
                                type="checkbox"
                                checked={editingItem.isTradeable}
                                onChange={(e) => setEditingItem({ ...editingItem, isTradeable: e.target.checked })}
                            />
                        </label>
                        <label>
                            Limitado:
                            <input
                                type="checkbox"
                                checked={editingItem.isLimited}
                                onChange={(e) => setEditingItem({ ...editingItem, isLimited: e.target.checked })}
                            />
                        </label>
                        {editingItem.isLimited && (
                            <input
                                type="number"
                                placeholder="Copias Limitadas"
                                value={editingItem.limitedCopies}
                                onChange={(e) => setEditingItem({ ...editingItem, limitedCopies: parseInt(e.target.value) })}
                            />
                        )}
                        {urlError && <p className="error">{urlError}</p>}
                        <button onClick={() => handleEditItem(editingItem.id, editingItem)}>Guardar</button>
                        <button className="cancel" onClick={closeEditPanel}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ItemList;