import api from '../services/api';

/** 
 * Obtenemos la lista de hospitales/centros desde la base de datos
 */
export const getLocations = async () => {
    try {
        const response = await api.get('/api/hospitales');
        return response.data; // Devuelve la lista de hospitales desde la BD
    } catch (error) {
        console.error("Error al obtener los hospitales:", error);
        return []; // Devolvemos un array vacío en caso de error
    }
};

/* Opcional a futuro, obtener el hospital por su ID */
export const getLocationById = async (id) => {
    try {
        const response = await api.get(`api/hospitales/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener el hospital con ID ${id}: `, error);
        return null; // Devolvemos nulo y no un array vacío porque estámos buscando por ID y eso devuelve una entidad solo
    }
};