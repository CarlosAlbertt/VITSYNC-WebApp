import { describe, it, expect, vi, afterEach } from 'vitest';
import { logger } from '../../utils/logger';

afterEach(() => vi.restoreAllMocks());

describe('logger (condicional por entorno)', () => {
    // Vitest corre con import.meta.env.DEV = true: el logger debe emitir
    it('en dev emite con prefijo [VitSync]', () => {
        const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
        logger.log('hola');
        expect(spy).toHaveBeenCalledWith('[VitSync]', 'hola');
    });

    it('warn y error delegan en console con prefijo', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        logger.warn('aviso');
        logger.error('fallo');
        expect(warnSpy).toHaveBeenCalledWith('[VitSync]', 'aviso');
        expect(errorSpy).toHaveBeenCalledWith('[VitSync]', 'fallo');
    });
});
