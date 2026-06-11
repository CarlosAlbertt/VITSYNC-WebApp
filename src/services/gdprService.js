import api from './api';
import { currentUser } from '../store/auth';

/**
 * GDPR data-subject rights API (backed by VITSYNC-API GdprController).
 *
 * Endpoints reales del backend:
 * - GET    /api/users/{id}/my-data         (Art. 15, acceso)
 * - GET    /api/users/{id}/my-data/export  (Art. 20, ZIP; límite 1/24h)
 * - DELETE /api/users/{id}/gdpr-delete     (Art. 17, olvido: anonimización a 30 días)
 */

const userId = () => currentUser.value.id;

/**
 * Fetches everything the platform stores about the user (Art. 15).
 *
 * @returns {Promise<object>} structured data: perfil, citas, informes, mensajes
 */
export const getMyData = async () => {
    const response = await api.get(`/api/users/${userId()}/my-data`);
    return response.data;
};

/**
 * Downloads the portability ZIP (Art. 20). Rate-limited server-side to one
 * export per 24h — a 429 includes Retry-After.
 *
 * @returns {Promise<Blob>} the ZIP archive
 */
export const exportMyData = async () => {
    const response = await api.get(`/api/users/${userId()}/my-data/export`, {
        responseType: 'blob'
    });
    return response.data;
};

/**
 * Starts the right-to-erasure flow (Art. 17): the backend suspends the
 * account, revokes sessions, cancels future appointments and schedules
 * anonymisation after a 30-day waiting period.
 *
 * @returns {Promise<object>} `{ message, scheduledAnonymizationDate }`
 */
export const requestAccountDeletion = async () => {
    const response = await api.delete(`/api/users/${userId()}/gdpr-delete`);
    return response.data;
};
