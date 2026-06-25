import api from './api';

/**
 * Forgotten-password recovery flow (public — no session required).
 *
 * Three steps against the API:
 *  1. `recoveryQuestions(nif)`   → returns the user's two security questions.
 *  2. `recoveryVerify(...)`      → checks both answers; on success the API
 *                                  emails a one-time code.
 *  3. `recoveryReset(...)`       → validates the code and sets the new password.
 *
 * All errors are surfaced with the backend's user-facing message so the page
 * can show "Respuestas incorrectas", "Código caducado", etc.
 */

/** Step 1 — fetch the two security questions for the given NIF. */
export const recoveryQuestions = async (nif) => {
    try {
        const response = await api.post('/api/auth/recovery/questions', { nif });
        return response.data; // { question1, question2 }
    } catch (error) {
        throw new Error(error.response?.data?.message
            || 'No se pudo iniciar la recuperación');
    }
};

/** Step 2 — verify both answers; on success the API emails a reset code. */
export const recoveryVerify = async (nif, answer1, answer2) => {
    try {
        const response = await api.post('/api/auth/recovery/verify', { nif, answer1, answer2 });
        return response.data; // { message }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Respuestas incorrectas');
    }
};

/** Step 3 — validate the emailed code and set the new password. */
export const recoveryReset = async (nif, code, newPassword) => {
    try {
        const response = await api.post('/api/auth/recovery/reset', { nif, code, newPassword });
        return response.data; // { message }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'No se pudo restablecer la contraseña');
    }
};
