import React, { useState } from 'react';
import { getApiUrl, validateForm } from '../utils/fvUtils.js';
import { Helmet } from 'react-helmet';
import '../styles/Auth.css';

function AuthModule() {
    const [activeTab, setActiveTab] = useState('login'); // 'login' o 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [peludToken, setPeludToken] = useState('');
    const [showPeludTokenForm, setShowPeludTokenForm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [messages, setMessages] = useState([]);

    if (localStorage.getItem('Authorization')) {
        window.location.href = '/';
    }

    const handleAuthSubmit = async (e) => {
        e.preventDefault();

        const user = { email, password, username, activeTab };

        if (!validateForm(user, null, setMessages, true, 'user')) {
            return;
        }

        try {
            const urlNav = await getApiUrl(activeTab === 'login' ? 'auth/login' : 'auth/register');
            const requestBody = { email, password };
            if (activeTab === 'register') requestBody.username = username;

            const response = await fetch(urlNav, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (response.ok) {
                const token = data.token;
                const username = data.user;

                if (activeTab === 'login') {
                    const newUrl = await getApiUrl("auth/protected");
                    const validateToken = await fetch(newUrl, {
                        method: 'GET',
                        headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                    });

                    if (validateToken.ok) {
                        const check = await validateToken.json();
                        if (check.error) {
                            setMessages((prev) => [...prev, { type: 'error', text: `Inicio de Sesión fallido: ${check.error}` }]);
                            setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
                            return;
                        } else {
                            localStorage.setItem('Authorization', token);
                            localStorage.setItem('CurrentUser-Username', username);

                            const roleUrl = await getApiUrl("auth/admin");
                            const roleResponse = await fetch(roleUrl, {
                                method: 'GET',
                                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                            });
                            if (roleResponse.ok) {
                                const roleData = await roleResponse.json();
                                localStorage.setItem('CurrentUser-Role', roleData.user.role);
                            } else {
                                localStorage.setItem('CurrentUser-Role', 'user'); // Asignar 'user' como rol por defecto en caso de fallo
                            }

                            setMessages((prev) => [...prev, { type: 'success', text: 'Inicio de Sesión exitoso' }]);
                            setTimeout(() => { window.location.href = '/'; }, 3000);
                        }
                    } else {
                        console.error("La verificación del token ha fallado");
                    }
                } else if (activeTab === 'register') {
                    setMessages((prev) => [...prev, { type: 'success', text: 'Registro exitoso: Ahora puede iniciar sesión' }]);
                    setActiveTab('login');
                }
            } else {
                setMessages((prev) => [...prev, { type: 'error', text: `${activeTab === 'login' ? 'Inicio de Sesión' : 'Registro'} fallido: ${data.error}` }]);
            }
        } catch (error) {
            setMessages((prev) => [...prev, { type: 'error', text: `${activeTab === 'login' ? 'Inicio de Sesión' : 'Registro'} fallido: El servidor no ha respondido` }]);
            console.error('Error durante la autenticación:', error);
        }
    };

    const handlePeludTokenSubmit = async (e) => {
        e.preventDefault();

        try {
            const tokenUrl = await getApiUrl('auth/verify-token');
            const tokenResponse = await fetch(tokenUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ peludToken }),
            });

            const tokenData = await tokenResponse.json();

            if (tokenResponse.ok) {
                setPeludToken('');
                setShowPeludTokenForm(false);
                setMessages((prev) => [...prev, { type: 'success', text: 'Token verificado con éxito. Puede continuar con el registro.' }]);
                setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            } else {
                setMessages((prev) => [...prev, { type: 'error', text: `Error en la verificación del token: ${tokenData.error}` }]);
            }
        } catch (error) {
            setMessages((prev) => [...prev, { type: 'error', text: 'Error en la verificación del token: El servidor no ha respondido' }]);
            console.error('Error durante la verificación del token:', error);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleShowPeludTokenForm = () => {
        setShowPeludTokenForm(true);
    };

    return (
        <div className="auth-module">
            <Helmet>
                <title>Cuenta | FurVentura</title>
            </Helmet>
            {showPeludTokenForm ? (
                <div className='auth-form'>
                    <h2>Ingresa tu PeludToken</h2>
                    <input
                        type="text"
                        placeholder="PeludToken"
                        value={peludToken}
                        onChange={(e) => setPeludToken(e.target.value)}
                    />
                    <button className="pelud-token-button" onClick={handlePeludTokenSubmit}>
                        Verificar PeludToken
                    </button>
                    <button className="cancel-button" onClick={() => setShowPeludTokenForm(false)}>
                        Cancelar
                    </button>
                </div>
            ) : (
                <div>
                    <div className="auth-tabs">
                        <button
                            className={activeTab === 'login' ? 'active' : ''}
                            onClick={() => setActiveTab('login')}
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            className={activeTab === 'register' ? 'active' : ''}
                            onClick={() => setActiveTab('register')}
                        >
                            Registrarse
                        </button>
                    </div>
                    <form className="auth-form" onSubmit={handleAuthSubmit}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="email"
                                placeholder="✉️ Correo Electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>
                        {activeTab === 'register' && (
                            <input
                                type="text"
                                placeholder="👤 Usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        )}
                        <div className="password-input">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="🔑 Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                style={{ width: 'calc(100% - 50px)', marginRight: '15px' }}
                            />
                            <button
                                type="button"
                                className="toggle-password-button"
                                onClick={toggleShowPassword}
                                style={{ top: '16%', width: '40px', height: '39px', marginRight: '-10px' }}
                            >
                                {showPassword ? <i className='fa-solid fa-eye-slash' /> : <i className='fa-solid fa-eye' />}
                            </button>
                        </div>

                        <button type="submit">
                            {activeTab === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                        </button>
                    </form>
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

                    <p>────────────── O ──────────────</p>
                    <p>Próximamente</p>
                    <div className="external-auth-buttons">
                        <button className="discord" disabled>
                            Discord
                        </button>
                        <button className="google" disabled>
                            Google
                        </button>
                        <button className="pelud" onClick={handleShowPeludTokenForm} disabled>
                            PeludToken
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AuthModule;