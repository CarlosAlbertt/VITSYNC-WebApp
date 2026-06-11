import DOMPurify from 'dompurify';

/**
 * Sanitisation helpers for the rare places that render raw markup.
 *
 * REGLA: `v-html` está prohibido sin pasar por aquí. Para texto normal,
 * usar interpolación `{{ }}` (Vue ya escapa). Estos helpers existen para
 * los iconos SVG y cualquier HTML enriquecido futuro.
 */

/** Strict config for inline SVG icon fragments (paths/shapes only). */
const SVG_CONFIG = {
    USE_PROFILES: { svg: true },
    ALLOWED_TAGS: ['svg', 'g', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse'],
    ALLOWED_ATTR: [
        'd', 'points', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2',
        'width', 'height', 'viewBox', 'fill', 'stroke', 'stroke-width',
        'stroke-linecap', 'stroke-linejoin', 'transform'
    ]
};

/** Strict config for server/user-provided rich text (sanitary domain). */
const HTML_CONFIG = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
    ALLOWED_ATTR: []
};

/**
 * Sanitises an inline SVG fragment before `v-html`.
 *
 * @param {string} svg raw SVG markup
 * @returns {string} safe markup (event handlers/scripts stripped)
 */
export const sanitizeSvg = (svg) => DOMPurify.sanitize(svg || '', SVG_CONFIG);

/**
 * Sanitises rich text coming from the API or the user before `v-html`.
 *
 * @param {string} html raw HTML
 * @returns {string} safe markup limited to basic formatting tags
 */
export const sanitizeHtml = (html) => DOMPurify.sanitize(html || '', HTML_CONFIG);
