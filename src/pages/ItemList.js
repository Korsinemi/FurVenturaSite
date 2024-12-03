import React, { useEffect, useState, useCallback } from 'react';
import { getApiUrl, validateForm } from '../utils/fvUtils.js';
import { fileUpload, deleteImage } from '../utils/imagekitUtils.js';
import { Helmet } from 'react-helmet';
import '../styles/Lists.css';

const ItemList = ({ role }) => {
    const [items, setItems] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [newItem, setNewItem] = useState({ name: '', rarity: '', type: '', description: '', icon: '', uses: 0, obtetionMethod: '', isTradeable: false, isLimited: false, limitedCopies: 0 });
    const [iconFile, setIconFile] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [messages, setMessages] = useState([]);
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
                    setMessages((prev) => [...prev, { type: 'error', text: 'Error al buscar el item' }]);
                    setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
                });
        } else {
            fetchItems();
        }
    };

    const handleAddItem = async () => {
        if (!validateForm(newItem, iconFile, setMessages, false, 'item')) {
            return;
        }

        const iconUrl = await fileUpload(iconFile, setMessages);
        if (!iconUrl) return;

        const newItemWithIcon = { ...newItem, icon: iconUrl };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newItemWithIcon),
        })
            .then(response => response.json())
            .then((addedItem) => {
                fetchItems();
                setNewItem({ name: '', rarity: '', type: '', description: '', icon: '', uses: 0, obtetionMethod: '', isTradeable: false, isLimited: false, limitedCopies: 0 });
                setIconFile(null);
                setShowAddForm(false);
                setMessages((prev) => [...prev, { type: 'success', text: `Se agregó ${addedItem.name} (ID: ${addedItem.id}) satisfactoriamente` }]);
                setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            })
            .catch(error => {
                console.error('Error:', error);
                setMessages((prev) => [...prev, { type: 'error', text: 'Error al agregar el item' }]);
                setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            });
    };

    const handleEditItem = async (id, updatedItem) => {
        if (!validateForm(updatedItem, iconFile, setMessages, true, 'item')) {
            return;
        }

        let iconUrl = updatedItem.icon;

        if (iconFile) {
            await deleteImage(iconUrl, setMessages);
            iconUrl = await fileUpload(iconFile, setMessages);
            if (!iconUrl) return;
        }

        const updatedItemWithIcon = { ...updatedItem, icon: iconUrl };

        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedItemWithIcon),
        })
            .then(response => response.json())
            .then((updatedItem) => {
                fetchItems();
                setEditingItem(null);
                setIconFile(null);
                setMessages((prev) => [...prev, { type: 'success', text: `Se actualizó ${updatedItem.name} (ID: ${updatedItem.id}) satisfactoriamente` }]);
                setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            })
            .catch(error => {
                console.error('Error:', error);
                setMessages((prev) => [...prev, { type: 'error', text: 'Error al editar el item' }]);
                setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            });
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
            const item = items.find(i => i.id === id);

            try {
                if (item && item.icon) {
                    await deleteImage(item.icon, setMessages);
                }

                const response = await fetch(`${apiUrl}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (response.ok) {
                    fetchItems();
                    setMessages((prev) => [...prev, { type: 'success', text: `Se eliminó ${item.name} (ID: ${item.id}) satisfactoriamente` }]);
                    setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
                } else {
                    throw new Error('Failed to delete item');
                }
            } catch (error) {
                console.error('Error:', error);
                setMessages((prev) => [...prev, { type: 'error', text: 'Error al eliminar el item' }]);
                setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            }
        }
    };

    return (
        <div className="furventura-lists">
            <Helmet>
                <title>Items | FurVentura</title>
            </Helmet>
            <h2>Items</h2>
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
                                    <button onClick={() => setEditingItem(item)}>Editar</button>
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
                        <label>Icono:</label>
                        <input
                            type="file"
                            onChange={(e) => setIconFile(e.target.files[0])}
                        />
                        <label>Nombre:</label>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        />
                        <label>Rareza:</label>
                        <input
                            type="text"
                            placeholder="Rareza"
                            value={newItem.rarity}
                            onChange={(e) => setNewItem({ ...newItem, rarity: e.target.value })}
                        />
                        <label>Tipo:</label>
                        <input
                            type="text"
                            placeholder="Tipo"
                            value={newItem.type}
                            onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                        />
                        <label>Descripción:</label>
                        <input
                            type="text"
                            placeholder="Descripción"
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        />
                        <label>Usos:</label>
                        <input
                            type="number"
                            placeholder="Usos"
                            value={newItem.uses}
                            onChange={(e) => setNewItem({ ...newItem, uses: parseInt(e.target.value) })}
                        />
                        <label>Metodo de Obtención:</label>
                        <select
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
                        <button onClick={handleAddItem}>Agregar</button>
                        <button onClick={() => setShowAddForm(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {editingItem && (
                <div className="overlay">
                    <div className="form-panel">
                        <h3>Editar Item</h3>
                        <label>Icono:</label>
                        <input
                            type="file"
                            onChange={(e) => setIconFile(e.target.files[0])}
                        />
                        <label>Nombre:</label>
                        <input
                            type="text"
                            placeholder="Ingrese el nombre"
                            value={editingItem.name}
                            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        />
                        <label>Rareza:</label>
                        <input
                            type="text"
                            placeholder="Ingrese la rareza"
                            value={editingItem.rarity}
                            onChange={(e) => setEditingItem({ ...editingItem, rarity: e.target.value })}
                        />
                        <label>Tipo:</label>
                        <input
                            type="text"
                            placeholder="Ingrese el tipo"
                            value={editingItem.type}
                            onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value })}
                        />
                        <label>Descripción:</label>
                        <input
                            type="text"
                            placeholder="Ingrese la descripción"
                            value={editingItem.description}
                            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        />
                        <label>Usos:</label>
                        <input
                            type="number"
                            placeholder="Usos"
                            value={editingItem.uses}
                            onChange={(e) => setEditingItem({ ...editingItem, uses: parseInt(e.target.value) })}
                        />
                        <label>Metodo de Obtención:</label>
                        <select
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
                            <>
                                <label>Copias Limitadas:</label>
                                <input
                                    type="number"
                                    placeholder="Copias Limitadas"
                                    value={editingItem.limitedCopies}
                                    onChange={(e) => setEditingItem({ ...editingItem, limitedCopies: parseInt(e.target.value) })}
                                />
                            </>
                        )}
                        <button onClick={() => handleEditItem(editingItem.id, editingItem)}>Guardar</button>
                        <button className="cancel" onClick={() => setEditingItem(null)}>Cancelar</button>
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

export default ItemList;