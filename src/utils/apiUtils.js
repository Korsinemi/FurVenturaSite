export const getApiUrl = async (endpoint) => {
    try {
        const response = await fetch(`http://localhost:5000/api/${endpoint}`);
        if (response.ok) {
            console.log('Servidor local disponible');
            return `http://localhost:5000/api/${endpoint}`;
        } else {
            console.log('Usando servidor alternativo');
            return `http://localhost:5000/api/${endpoint}`;
        }
    } catch (error) {
        console.error('Error al verificar el servidor:', error.message);
        return `http://localhost:5000/api/${endpoint}`;
    }
};
