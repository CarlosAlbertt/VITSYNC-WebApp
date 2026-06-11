import { describe, it, expect } from 'vitest';
import { sanitizeSvg, sanitizeHtml } from '../../utils/sanitize';

describe('sanitizeSvg', () => {
    it('conserva paths de iconos legítimos', () => {
        const icon = '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67"/>';
        expect(sanitizeSvg(icon)).toContain('<path');
        expect(sanitizeSvg(icon)).toContain('d="M20.84');
    });

    it('elimina <script> por completo', () => {
        const out = sanitizeSvg('<path d="M1 1"/><script>alert(1)</script>');
        expect(out).not.toContain('script');
        expect(out).not.toContain('alert');
    });

    it('elimina manejadores de eventos (onclick/onload)', () => {
        const out = sanitizeSvg('<path d="M1 1" onclick="steal()" onload="x()"/>');
        expect(out).not.toContain('onclick');
        expect(out).not.toContain('onload');
    });

    it('elimina foreignObject e iframes embebidos', () => {
        const out = sanitizeSvg('<foreignObject><iframe src="https://evil.example"></iframe></foreignObject>');
        expect(out).not.toContain('iframe');
        expect(out).not.toContain('foreignObject');
    });

    it('null/undefined → cadena vacía sin lanzar', () => {
        expect(sanitizeSvg(null)).toBe('');
        expect(sanitizeSvg(undefined)).toBe('');
    });
});

describe('sanitizeHtml (texto enriquecido sanitario)', () => {
    it('permite solo formato básico', () => {
        const out = sanitizeHtml('<p>Hola <strong>mundo</strong></p>');
        expect(out).toContain('<strong>mundo</strong>');
    });

    it('script tag → eliminado', () => {
        expect(sanitizeHtml('<script>document.cookie</script>')).toBe('');
    });

    it('elimina atributos (href/src/style incluidos)', () => {
        const out = sanitizeHtml('<p style="background:url(x)" data-x="1">texto</p>');
        expect(out).not.toContain('style');
        expect(out).not.toContain('data-x');
    });

    it('img con onerror → eliminada', () => {
        const out = sanitizeHtml('<img src=x onerror=alert(1)>');
        expect(out).not.toContain('img');
        expect(out).not.toContain('onerror');
    });
});
