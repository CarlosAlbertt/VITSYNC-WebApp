/**
 * Client-side validators mirroring the backend rules (VITSYNC-API DTOs).
 *
 * IMPORTANTE: esta validación es UX (feedback inmediato, menos round-trips).
 * La validación de SEGURIDAD real vive en el backend (@Valid + @ValidNif):
 * nada de lo que pase aquí debe asumirse seguro.
 *
 * Cada validador devuelve `null` si es válido o un mensaje de error
 * mostrable al usuario.
 */

/** Letras de control oficiales del NIF, indexadas por (número % 23). */
const NIF_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';

/**
 * Validates a Spanish NIF/NIE including the mod-23 control digit
 * (same algorithm as the backend's @ValidNif).
 *
 * @param {string} value raw NIF/NIE
 * @returns {string|null} error message or null
 */
export const validateNif = (value) => {
    const nif = (value || '').trim().toUpperCase();
    if (!/^[0-9]{8}[A-Z]$/.test(nif) && !/^[XYZ][0-9]{7}[A-Z]$/.test(nif)) {
        return 'El documento debe ser un NIF (8 dígitos + letra) o NIE (X/Y/Z + 7 dígitos + letra)';
    }
    // NIE: X→0, Y→1, Z→2 antes de calcular el módulo
    const digits = nif.replace(/^X/, '0').replace(/^Y/, '1').replace(/^Z/, '2').slice(0, 8);
    const expected = NIF_LETTERS[parseInt(digits, 10) % 23];
    if (nif[8] !== expected) {
        return 'La letra del documento no es correcta';
    }
    return null;
};

/**
 * Validates an email address (basic format + RFC length cap).
 *
 * @param {string} value email
 * @returns {string|null}
 */
export const validateEmail = (value) => {
    const email = (value || '').trim();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'El formato de correo electrónico no es válido';
    }
    return null;
};

/**
 * Validates the password against the backend policy: ≥12 characters with
 * uppercase, lowercase, digit and special character.
 *
 * @param {string} value password
 * @returns {string|null}
 */
export const validatePassword = (value) => {
    const pass = value || '';
    if (pass.length < 12
        || !/[A-Z]/.test(pass) || !/[a-z]/.test(pass)
        || !/[0-9]/.test(pass) || !/[^A-Za-z0-9]/.test(pass)) {
        return 'La contraseña debe tener al menos 12 caracteres e incluir mayúscula, minúscula, número y carácter especial';
    }
    return null;
};

/**
 * Validates a Spanish phone number (mobile or landline, optional +34 prefix).
 *
 * @param {string} value phone
 * @returns {string|null}
 */
export const validatePhone = (value) => {
    const phone = (value || '').replace(/[\s-]/g, '');
    if (!/^(\+34|0034|34)?[6789]\d{8}$/.test(phone)) {
        return 'El teléfono debe ser español: 9 dígitos empezando por 6, 7, 8 o 9 (prefijo +34 opcional)';
    }
    return null;
};

/**
 * Validates a person name: letters, spaces and hyphens, max 100 chars.
 *
 * @param {string} value name
 * @returns {string|null}
 */
export const validateName = (value) => {
    const name = (value || '').trim();
    if (!name || name.length > 100 || !/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ][a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s'-]*$/.test(name)) {
        return 'Solo letras, espacios y guiones (máximo 100 caracteres)';
    }
    return null;
};

/**
 * Validates a Spanish postal code (5 digits, province 01-52).
 *
 * @param {string} value postal code
 * @returns {string|null}
 */
export const validatePostalCode = (value) => {
    if (!/^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test((value || '').trim())) {
        return 'El código postal debe tener 5 dígitos (provincia 01–52)';
    }
    return null;
};

/**
 * Validates a birth date: must exist and not be in the future.
 *
 * @param {string} value ISO date (yyyy-mm-dd)
 * @returns {string|null}
 */
export const validateBirthDate = (value) => {
    if (!value) return 'La fecha de nacimiento es obligatoria';
    const date = new Date(value);
    if (Number.isNaN(date.getTime()) || date > new Date()) {
        return 'La fecha de nacimiento no puede ser futura';
    }
    return null;
};
