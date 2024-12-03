import validator from 'validator';

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

export const validateForm = (entity, iconFile, setMessages, isEditing = false, type) => {
    const errors = [];

    if (!type) {
        throw new Error('Tipo de entidad no especificado');
    }

    if (type === 'user') {
        if (!entity.email.trim() || !validator.isEmail(entity.email)) {
            errors.push('El correo electrónico no es válido.');
        } else if (!entity.email) {
            errors.push('Necesitas ingresar un correo electrónico');
        }
        if (entity.password.length < 6) {
            errors.push('La contraseña debe tener al menos 6 caracteres.');
        }
        if (entity.activeTab === 'register' && !entity.username.trim()) {
            errors.push('El nombre de usuario no puede quedar vacío.');
        }
    } else {
        if (!entity.name.trim()) {
            errors.push('El nombre no puede quedar vacío');
        } else if ((type === 'item' && entity.name.length > 50) ||
            (type === 'animal' && entity.name.length > 15) ||
            (type === 'achievement' && entity.name.length > 50) ||
            (type === 'event' && entity.name.length > 50)) {
            errors.push(`El nombre excede el número de caracteres permitidos: ${type === 'item' || type === 'achievement' || type === 'event' ? 50 : 15}`);
        }
    }

    if (type === 'item') {
        if (!entity.rarity.trim()) {
            errors.push('La rareza no puede quedar vacía');
        }
        if (!entity.type.trim()) {
            errors.push('El tipo no puede quedar vacío');
        }
        if (!entity.description.trim()) {
            errors.push('La descripción no puede quedar vacía');
        } else if (entity.description.length > 200) {
            errors.push('La descripción excede el número de caracteres permitidos: 200');
        }
        if (entity.uses <= 0 || isNaN(entity.uses)) {
            errors.push('El número de usos debe ser mayor que 0');
        }
        if (entity.obtetionMethod === '') {
            errors.push('Especifica un método de obtención');
        }
        if (entity.isLimited && (entity.limitedCopies <= 0 || isNaN(entity.limitedCopies))) {
            errors.push('El número de copias limitadas debe ser mayor que 0');
        }
    }

    if (type === 'animal') {
        if (!entity.species.trim()) {
            errors.push('La especie no puede quedar vacía');
        } else if (entity.species.length > 15) {
            errors.push('La especie excede el número de caracteres permitidos: 15');
        }
        if (entity.rarity === '') {
            errors.push('No se seleccionó ninguna rareza');
        }
        if (!entity.class.trim()) {
            errors.push('La clase no puede quedar vacía');
        } else if (entity.class.length > 15) {
            errors.push('La clase excede el número de caracteres permitidos: 15');
        }
    }

    if (type === 'achievement') {
        if (!entity.description.trim()) {
            errors.push('La descripción no puede quedar vacía');
        } else if (entity.description.length > 200) {
            errors.push('La descripción excede el número de caracteres permitidos: 200');
        }
        if (!(entity.points > 0)) {
            errors.push('El logro no puede tener 0 puntos');
        }
    }

    if (type === 'event') {
        if (!entity.rewards.trim()) {
            errors.push('Las recompensas no pueden quedar vacías');
        }
        if (entity.participants <= 0) {
            errors.push('El número de participantes debe ser mayor que 0');
        }
        if (!entity.duration.trim()) {
            errors.push('La duración no puede quedar vacía');
        }
    }

    if (!isEditing && !iconFile) {
        errors.push('No se seleccionó ningún archivo');
    }

    if (errors.length > 0) {
        setMessages((prev) => [...prev, ...errors.map(error => ({ type: 'error', text: error }))]);
        setTimeout(() => setMessages((prev) => prev.slice(errors.length)), 6000);
    }

    return errors.length === 0;
};