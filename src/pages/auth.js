import React, { useState } from 'react';
import validator from 'validator';
import '../styles/Auth.css';
import { getApiUrl } from '../utils/apiUtils';
import { FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

function AuthModule() {
    const [activeTab, setActiveTab] = useState('login'); // 'login' o 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [peludToken, setPeludToken] = useState('');
    const [showPeludTokenForm, setShowPeludTokenForm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    if (localStorage.getItem('Authorization')) {
        window.location.href = '/';
    }

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
                const token = data.token;
                const username = data.user;

                if (activeTab === 'login') {
                    const newUrl = await getApiUrl("auth/protected");
                    const validateToken = await fetch(newUrl, {
                        method: 'GET',
                        headers: {
                            'Authorization': token,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (validateToken.ok) {
                        const check = await validateToken.json();
                        if (check.error) {
                            await setErrorMessage(
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <FaTimesCircle style={{ marginRight: '8px' }} />
                                    <span>Inicio de Sesión fallido: {check.error}</span>
                                </div>
                            );
                            return;
                        } else {
                            console.log(check.mensaje);
                            localStorage.setItem('Authorization', token);
                            localStorage.setItem('CurrentUser-Username', username);
                            // Verificar el rol del usuario con el token
                            const roleUrl = await getApiUrl("auth/admin");
                            const roleResponse = await fetch(roleUrl, {
                                method: 'GET',
                                headers: {
                                    'Authorization': token,
                                    'Content-Type': 'application/json',
                                },
                            });
                            if (roleResponse.ok) {
                                const roleData = await roleResponse.json();
                                localStorage.setItem('CurrentUser-Role', roleData.user.role);
                            } else {
                                localStorage.setItem('CurrentUser-Role', 'user'); // Asignar 'user' como rol por defecto en caso de fallo
                            }
                            await setSuccessMessage(
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <FaCheckCircle style={{ marginRight: '8px' }} />
                                    <span>Inicio de Sesión exitoso</span>
                                </div>
                            );
                            setTimeout(() => {
                                window.location.href = '/';
                            }, 3000);
                        }
                    } else {
                        console.error("La verificación del token ha fallado")
                    }
                } else if (activeTab === 'register') {
                    await setSuccessMessage(
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FaCheckCircle style={{ marginRight: '8px' }} />
                            <span>Registro exitoso: Ahora puede iniciar sesión</span>
                        </div>
                    );
                    setActiveTab('login');
                }
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