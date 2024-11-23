export const getApiUrl = async (endpoint) => {
    const isLocalhost = window.location.hostname === 'localhost';
    const localApiUrl = `http://localhost:5000/api/${endpoint}`;
    const productionApiUrl = `https://fvapi.korsinemi.link/api/${endpoint}`;

    try {
        if (isLocalhost) {
            console.log('Usando localhost (entorno de desarrollo)');
            return localApiUrl;
        } else {
            return productionApiUrl;
        }
    } catch (error) {
        console.error('Error al conectar con la API real:', error.message);
        console.log('Usando localhost debido al error.');
        return localApiUrl;
    }
};