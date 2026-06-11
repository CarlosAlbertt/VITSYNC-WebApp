import { describe, it, expect } from 'vitest';
import {
    validateNif, validateEmail, validatePassword, validatePhone,
    validateName, validatePostalCode, validateBirthDate
} from '../../utils/validators';

describe('validateNif (dígito de control mod-23)', () => {
    it.each(['12345678Z', '00000000T', '11111111H', '99999999R'])('NIF válido %s → null', (nif) => {
        expect(validateNif(nif)).toBeNull();
    });

    it('acepta minúsculas y espacios alrededor', () => {
        expect(validateNif(' 12345678z ')).toBeNull();
    });

    it.each(['X1234567L', 'Y1234567X', 'Z1234567R'])('NIE válido %s → null', (nie) => {
        expect(validateNif(nie)).toBeNull();
    });

    it('letra de control incorrecta → error', () => {
        expect(validateNif('12345678A')).not.toBeNull();
    });

    it('longitud incorrecta → error', () => {
        expect(validateNif('1234567Z')).not.toBeNull();
    });

    it('basura → error', () => {
        expect(validateNif('ABCDEFGHI')).not.toBeNull();
        expect(validateNif('')).not.toBeNull();
        expect(validateNif(null)).not.toBeNull();
    });
});

describe('validateEmail', () => {
    it('email correcto → null', () => {
        expect(validateEmail('ana@vitsync.es')).toBeNull();
    });

    it('sin arroba o sin dominio → error', () => {
        expect(validateEmail('ana.vitsync.es')).not.toBeNull();
        expect(validateEmail('ana@')).not.toBeNull();
    });

    it('más de 254 caracteres → error', () => {
        expect(validateEmail('a'.repeat(250) + '@b.com')).not.toBeNull();
    });
});

describe('validatePassword (política backend: ≥12 + 4 clases)', () => {
    it('contraseña fuerte → null', () => {
        expect(validatePassword('Password123!Abc')).toBeNull();
    });

    it.each([
        'Password1!',        // 10 chars: corta
        'password123!abc',   // sin mayúscula
        'PASSWORD123!ABC',   // sin minúscula
        'PasswordAbc!def',   // sin número
        'Password123Abcd'    // sin especial
    ])('débil %s → error', (pass) => {
        expect(validatePassword(pass)).not.toBeNull();
    });
});

describe('validatePhone (España)', () => {
    it.each(['612345678', '+34612345678', '34712345678', '912 345 678'])('válido %s → null', (phone) => {
        expect(validatePhone(phone)).toBeNull();
    });

    it.each(['512345678', '61234567', '+1 555 0100'])('inválido %s → error', (phone) => {
        expect(validatePhone(phone)).not.toBeNull();
    });
});

describe('validateName', () => {
    it('acepta letras, acentos, espacios y guiones', () => {
        expect(validateName('María-José Núñez')).toBeNull();
    });

    it('rechaza dígitos, vacío y >100 chars', () => {
        expect(validateName('Ana123')).not.toBeNull();
        expect(validateName('')).not.toBeNull();
        expect(validateName('a'.repeat(101))).not.toBeNull();
    });
});

describe('validatePostalCode', () => {
    it('CP español válido → null', () => {
        expect(validatePostalCode('46001')).toBeNull();
        expect(validatePostalCode('52006')).toBeNull();
    });

    it('provincia inexistente o formato malo → error', () => {
        expect(validatePostalCode('99999')).not.toBeNull();
        expect(validatePostalCode('4600')).not.toBeNull();
    });
});

describe('validateBirthDate', () => {
    it('fecha pasada → null', () => {
        expect(validateBirthDate('1990-01-15')).toBeNull();
    });

    it('futura, vacía o inválida → error', () => {
        expect(validateBirthDate('2999-01-01')).not.toBeNull();
        expect(validateBirthDate('')).not.toBeNull();
        expect(validateBirthDate('no-es-fecha')).not.toBeNull();
    });
});
