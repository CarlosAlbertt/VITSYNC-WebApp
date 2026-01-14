import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Login from '../../src/pages/Login.vue'
import { login } from '../../src/store/auth'

// Mock del router
const mockRouter = {
    push: vi.fn(),
    currentRoute: {
        value: { name: 'login' }
    }
}

vi.mock('vue-router', () => ({
    useRouter: () => mockRouter
}))

vi.mock('../../src/store/auth', () => ({
    login: vi.fn()
}))

describe('Login Component', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.clearAllMocks()
        mockRouter.currentRoute.value.name = 'login'
    })

    it('should login successfully with correct credentials', async () => {
        const wrapper = mount(Login)

        // Rellenar formulario con credenciales correctas
        await wrapper.find('#username').setValue('user')
        await wrapper.find('#password').setValue('123')

        // Enviar formulario
        await wrapper.find('form').trigger('submit.prevent')

        // Esperar a que se procese el login
        await wrapper.vm.$nextTick()

        // Verificaciones
        expect(login).toHaveBeenCalledWith('dummyToken')
        expect(mockRouter.push).toHaveBeenCalledWith({ name: 'home' })
    })

    it('should show error message with incorrect credentials', async () => {
        const wrapper = mount(Login)

        // Credenciales incorrectas
        await wrapper.find('#username').setValue('wronguser')
        await wrapper.find('#password').setValue('wrongpass')
        await wrapper.find('form').trigger('submit.prevent')

        await wrapper.vm.$nextTick()

        // Verificar que se muestra el mensaje de error
        expect(wrapper.vm.errorMessage).toBe('Usuario o contraseña incorrectos.')
        expect(login).not.toHaveBeenCalled()
    })

    it('should not submit form with empty fields', async () => {
        const wrapper = mount(Login)

        // Verificar que los campos tienen el atributo required
        const usernameInput = wrapper.find('#username')
        const passwordInput = wrapper.find('#password')

        expect(usernameInput.attributes('required')).toBeDefined()
        expect(passwordInput.attributes('required')).toBeDefined()
    })

    it('should clear error message on new login attempt', async () => {
        const wrapper = mount(Login)

        // Primer intento fallido
        await wrapper.find('#username').setValue('wrong')
        await wrapper.find('#password').setValue('wrong')
        await wrapper.find('form').trigger('submit.prevent')
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.errorMessage).toBeTruthy()

        // Segundo intento
        await wrapper.find('#username').setValue('user')
        await wrapper.find('#password').setValue('123')
        await wrapper.find('form').trigger('submit.prevent')
        await wrapper.vm.$nextTick()

        // El error debe haberse limpiado
        expect(wrapper.vm.errorMessage).toBeNull()
    })
})
