/**
 * Vitest global setup.
 *
 * Node 22+ expone un `localStorage` experimental propio que, sin el flag
 * `--localstorage-file`, es un stub sin métodos funcionales y ECLIPSA el de
 * jsdom. Se sustituye por una implementación en memoria completa para que
 * el código bajo test (migración de auth, preferencias UI) funcione.
 */
const createStorage = () => {
    let store = new Map();
    return {
        getItem: (k) => (store.has(String(k)) ? store.get(String(k)) : null),
        setItem: (k, v) => { store.set(String(k), String(v)); },
        removeItem: (k) => { store.delete(String(k)); },
        clear: () => { store.clear(); },
        key: (i) => [...store.keys()][i] ?? null,
        get length() { return store.size; }
    };
};

Object.defineProperty(globalThis, 'localStorage', { value: createStorage(), writable: true });
Object.defineProperty(globalThis, 'sessionStorage', { value: createStorage(), writable: true });
