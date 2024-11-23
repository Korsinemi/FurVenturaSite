import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Home = ({ isLoggedIn, actualUser }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const isCheater = localStorage.getItem('Cheater');
        if (isCheater === 'true') {
            navigate('/blocked');
        }
    }, [navigate]);

    const role = localStorage.getItem('CurrentUser-Role');

    return (
        <main>
            <Helmet>
                <title>FurVentura</title>
            </Helmet>
            {isLoggedIn ? (
                <>
                    <h2>Bienvenido a FurVentura, {actualUser}!</h2>
                    {role === 'admin' && <p><strong>SITIO DE ADMINISTRADOR</strong></p>}
                    <p>FurVentura es un emocionante juego de aventuras donde puedes explorar un mundo lleno de animales pixelados. Únete a nosotros y descubre todos los misterios que FurVentura tiene para ofrecer.</p>
                    <p>Es emocionante tenerte de regreso!</p>
                    <p>Para continuar, puedes ir al menú :3</p>
                </>
            ) : (
                <>
                    <h2>Bienvenido a FurVentura</h2>
                    <p>FurVentura es un emocionante juego de aventuras donde puedes explorar un mundo lleno de animales pixelados. Únete a nosotros y descubre todos los misterios que FurVentura tiene para ofrecer.</p>
                </>
            )}
        </main>
    );
};

export default Home;