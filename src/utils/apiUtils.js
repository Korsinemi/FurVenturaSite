export const checkServer = async (endpoint) => {
    try {
        const response = await fetch(`http://localhost:5000/api/${endpoint}`);
        if (response.ok) {
            console.log('Servidor local disponible');
            return `http://localhost:5000/api/${endpoint}`;
        } else {
            throw new Error('Servidor local no disponible');
        }
    } catch (error) {
        console.log('Usando servidor alternativo');
        return `https://fvapi.korsinemi.link/api/${endpoint}`;
    }
};

export const getApiUrl = async (endpoint) => {
    if (process.env.NODE_ENV === 'production') {
        return `https://fvapi.korsinemi.link/api/${endpoint}`;
    } else {
        return await checkServer(endpoint);
    }
}; 