import React, { useState } from 'react';
import validator from 'validator'; // Para la validación de URL
import '../styles/Auth.css'; // Tu CSS proporcionado
import { getApiUrl } from '../utils/apiUtils';
import { FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

function AuthModule() {
    const [activeTab, setActiveTab] = useState('login'); // 'login' o 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Nuevo estado para mensajes de éxito
    const [errorMessage, setErrorMessage] = useState('');
    const [peludToken, setPeludToken] = useState('');
    const [showPeludTokenForm, setShowPeludTokenForm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        if (!validator.isEmail(email) || password.length < 6) {
            return;
        }

        try {
            const urlNav = await getApiUrl(activeTab === 'login' ? 'auth/login' : 'auth/register');
            const requestBody = {
                email,
                password,
            };

            if (activeTab === 'register') {
                requestBody.username = username;
            }

            const response = await fetch(urlNav, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            setSuccessMessage('');
            setErrorMessage('');

            if (activeTab === 'peludtoken') {
                const peludResponse = await fetch('https://peludapi.korsinemi.link/auth/token', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: peludToken }),
                });

                if (peludResponse.ok) {
                    await setSuccessMessage(
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FaCheckCircle style={{ marginRight: '8px' }} />
                            <span>Incio con token exitoso</span>
                        </div>
                    );
                    localStorage.setItem('Authorization', peludResponse.authToken);
                    localStorage.setItem('PeludToken', peludToken);
                } else {
                    await setErrorMessage(
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FaTimesCircle style={{ marginRight: '8px' }} />
                            <span>Fallo fallido: {peludResponse.error}</span>
                        </div>
                    );
                    console.error('Token Pelud inválido');
                }
            }

            const data = await response.json();

            if (response.ok) {
                await setSuccessMessage(
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FaCheckCircle style={{ marginRight: '8px' }} />
                        <span>{activeTab === 'login' ? 'Inicio de Sesión' : 'Registro'} exitoso</span>
                    </div>
                );

                const token = data.token;
                localStorage.setItem('Authorization', token);

                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            } else {
                await setErrorMessage(
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FaTimesCircle style={{ marginRight: '8px' }} />
                        <span>{activeTab === 'login' ? 'Inicio de Sesión' : 'Registro'} fallido: {data.error}</span>
                    </div>
                );
            }
        } catch (error) {
            await setErrorMessage(
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaTimesCircle style={{ marginRight: '8px' }} />
                    <span>{activeTab === 'login' ? 'Inicio de Sesión' : 'Registro'} fallido: El servidor no ha respondido</span>
                </div>
            );
            console.error('Error durante la autenticación:', error);
        }
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
                    {successMessage && <p className="success">{successMessage}</p>}
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <button className="pelud-token-button" onClick={handleAuthSubmit}>
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
                            <FaCheckCircle style={{ marginRight: '2px', marginBottom: '-3px' }} /> Iniciar Sesión
                        </button>
                        <button
                            className={activeTab === 'register' ? 'active' : ''}
                            onClick={() => setActiveTab('register')}
                        >
                            Registrarse
                        </button>
                    </div>
                    <form className="auth-form" onSubmit={handleAuthSubmit}>
                        <input
                            type="email"
                            placeholder="Correo Electronico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {activeTab === 'register' && (
                            <input
                                type="text"
                                placeholder="Nombre de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        )}
                        <div className="password-input">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: 'calc(100% - 50px)', marginRight: '15px' }}
                            />
                            <button
                                type="button"
                                className="toggle-password-button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ top: '16%', width: '40px', height: '39px', marginRight: '-10px' }}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {successMessage && <p className="success">{successMessage}</p>}
                        {errorMessage && <p className="error">{errorMessage}</p>}
                        <button type="submit">
                            {activeTab === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                        </button>
                    </form>
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

export default AuthModule