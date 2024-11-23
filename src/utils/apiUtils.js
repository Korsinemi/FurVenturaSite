export const getApiUrl = async (endpoint) => {
    try {
        const isLocalhost = window.location.hostname === 'localhost';

        if (isLocalhost) {
            console.log('Usando localhost (entorno de desarrollo)');
            return `http://localhost:5000/api/${endpoint}`;
        } else {
            return `http://localhost:5000/api/${endpoint}`;
        }
    } catch (error) {
        console.error('Error al conectar con la API real:', error.message);
        console.log('Usando localhost debido al error.');
        return `http://localhost:5000/api/${endpoint}`;
    }
};

