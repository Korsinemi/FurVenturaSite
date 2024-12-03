import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getApiUrl } from './fvUtils.js';

function PrivateRoute({ element, isLoggedIn }) {
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkRole = async () => {
            const token = localStorage.getItem('Authorization');
            const storedRole = localStorage.getItem('CurrentUser-Role');
            const isCheater = localStorage.getItem('Cheater');

            if (isCheater === 'true') {
                window.location.href = '/blocked';
                return;
            }

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const verifyURL = await getApiUrl("auth/admin");
                const response = await fetch(verifyURL, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Añadir prefijo "Bearer " al token
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    const tokenRole = data.user.role;

                    if (storedRole === tokenRole) {
                        setRole(tokenRole);
                    } else {
                        localStorage.setItem('Cheater', 'true');
                        window.location.href = '/blocked';
                    }
                } else {
                    console.error("Error al verificar el rol del token");
                    // setRole('user');
                    // window.location.href = '/blocked';
                }
            } catch (error) {
                console.error("Error verificando el rol: ", error);
                // setRole('user');
                // window.location.href = '/blocked';
            } finally {
                setLoading(false);
            }
        };

        if (isLoggedIn) {
            checkRole();
        } else {
            setLoading(false);
        }
    }, [isLoggedIn]);

    if (loading) {
        return <p>Cargando...</p>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/account" replace />;
    }

    // Renderizar el componente pasado como prop si el usuario está autenticado
    return React.cloneElement(element, { role });
}

export default PrivateRoute;