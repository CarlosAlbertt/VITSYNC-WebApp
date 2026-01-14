import { describe, it, expect, beforeEach } from 'vitest'
import { isAuthenticated, login, logout } from '../../src/store/auth'

describe('Auth Store', () => {
    beforeEach(() => {
        localStorage.clear()
        isAuthenticated.value = false
    })

    it('should initialize as not authenticated', () => {
        expect(isAuthenticated.value).toBe(false)
    })

    it('should set authenticated state on login', () => {
        login('test-token')

        expect(isAuthenticated.value).toBe(true)
        expect(localStorage.getItem('token')).toBe('test-token')
    })

    it('should clear state on logout', () => {
        // Primero hacer login
        login('test-token')
        expect(isAuthenticated.value).toBe(true)

        // Luego logout
        logout()

        expect(isAuthenticated.value).toBe(false)
        expect(localStorage.getItem('token')).toBeNull()
    })

    it('should persist authentication state across page reloads', () => {
        // Simular que hay un token en localStorage
        localStorage.setItem('token', 'existing-token')

        // Reimportar el módulo para simular recarga
        const { isAuthenticated: newIsAuth } = require('../../src/store/auth')

        expect(newIsAuth.value).toBe(true)
    })

    it('should handle multiple login calls', () => {
        login('token1')
        expect(localStorage.getItem('token')).toBe('token1')

        login('token2')
        expect(localStorage.getItem('token')).toBe('token2')
        expect(isAuthenticated.value).toBe(true)
    })

    it('should handle logout when not authenticated', () => {
        expect(isAuthenticated.value).toBe(false)

        // No debería lanzar error
        logout()

        expect(isAuthenticated.value).toBe(false)
        expect(localStorage.getItem('token')).toBeNull()
    })
})
