import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Register from '../../src/pages/Register.vue'

// Mock del router
const mockRouter = {
    push: vi.fn(),
    currentRoute: {
        value: { name: 'register' }
    }
}

vi.mock('vue-router', () => ({
    useRouter: () => mockRouter
}))

describe('Register Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    const fillRequiredFields = async (wrapper, overrides = {}) => {
        const defaults = {
            name: 'Juan',
            second_name: 'Carlos',
            last_name: 'Pérez',
            username: 'juanperez',
            email: 'juan@test.com',
            password: 'Pass123!',
            confirmPassword: 'Pass123!',
            birth_date: '1990-01-01',
            gender: 'MALE',
            phone: '600000000',
            country: 'España',
            post_code: '28001',
            address: 'Calle Test 1'
        }

        const values = { ...defaults, ...overrides }

        await wrapper.find('#name').setValue(values.name)
        if (values.second_name) {
            await wrapper.find('#second_name').setValue(values.second_name)
        }
        await wrapper.find('#last_name').setValue(values.last_name)
        await wrapper.find('#username').setValue(values.username)
        await wrapper.find('#email').setValue(values.email)
        await wrapper.find('#password').setValue(values.password)
        await wrapper.find('#confirmPassword').setValue(values.confirmPassword)
        await wrapper.find('#birth_date').setValue(values.birth_date)
        await wrapper.find('#gender').setValue(values.gender)
        await wrapper.find('#phone').setValue(values.phone)
        await wrapper.find('#country').setValue(values.country)
        await wrapper.find('#post_code').setValue(values.post_code)
        await wrapper.find('#address').setValue(values.address)
    }

    it('should register user successfully with valid data', async () => {
        const wrapper = mount(Register)

        await fillRequiredFields(wrapper)
        await wrapper.find('form').trigger('submit.prevent')
        await wrapper.vm.$nextTick()

        // Verificar mensaje de éxito
        expect(wrapper.vm.successMessage).toContain('Registro completado con éxito')

        // Avanzar el tiempo para simular el timeout
        vi.advanceTimersByTime(1600)
        await wrapper.vm.$nextTick()

        // Verificar redirección
        expect(mockRouter.push).toHaveBeenCalledWith({ name: 'login' })
    })

    it('should show error when passwords do not match', async () => {
        const wrapper = mount(Register)

        await fillRequiredFields(wrapper, {
            password: 'Pass123!',
            confirmPassword: 'DifferentPass!'
        })

        await wrapper.find('form').trigger('submit.prevent')
        await wrapper.vm.$nextTick()

        // Verificar mensaje de error
        expect(wrapper.vm.errorMessage).toBe('Las contraseñas no coinciden.')
        expect(wrapper.vm.successMessage).toBeNull()
    })

    it('should validate required fields', async () => {
        const wrapper = mount(Register)

        // Verificar que los campos obligatorios tienen el atributo required
        const requiredFields = [
            '#name',
            '#last_name',
            '#username',
            '#email',
            '#password',
            '#confirmPassword',
            '#birth_date',
            '#phone',
            '#country',
            '#post_code',
            '#address'
        ]

        requiredFields.forEach(selector => {
            const field = wrapper.find(selector)
            expect(field.attributes('required')).toBeDefined()
        })

        // Verificar que second_name es opcional
        const secondNameField = wrapper.find('#second_name')
        expect(secondNameField.attributes('required')).toBeUndefined()
    })

    it('should validate email format', async () => {
        const wrapper = mount(Register)

        const emailInput = wrapper.find('#email')

        // Verificar que tiene el tipo email
        expect(emailInput.attributes('type')).toBe('email')
        expect(emailInput.attributes('required')).toBeDefined()
    })

    it('should clear error message on new registration attempt', async () => {
        const wrapper = mount(Register)

        // Primer intento con contraseñas que no coinciden
        await fillRequiredFields(wrapper, {
            password: 'Pass123!',
            confirmPassword: 'Different!'
        })
        await wrapper.find('form').trigger('submit.prevent')
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.errorMessage).toBeTruthy()

        // Segundo intento con datos correctos
        await fillRequiredFields(wrapper)
        await wrapper.find('form').trigger('submit.prevent')
        await wrapper.vm.$nextTick()

        // El error debe haberse limpiado
        expect(wrapper.vm.errorMessage).toBeNull()
        expect(wrapper.vm.successMessage).toBeTruthy()
    })

    it('should set role as PATIENT by default', async () => {
        const wrapper = mount(Register)

        await fillRequiredFields(wrapper)

        // Verificar que el rol por defecto es PATIENT
        expect(wrapper.vm.role).toBe('PATIENT')
    })

    it('should log user data on successful registration', async () => {
        const consoleSpy = vi.spyOn(console, 'log')
        const wrapper = mount(Register)

        await fillRequiredFields(wrapper)
        await wrapper.find('form').trigger('submit.prevent')
        await wrapper.vm.$nextTick()

        // Verificar que se loguean los datos
        expect(consoleSpy).toHaveBeenCalledWith(
            'Registrando usuario con datos completos:',
            expect.objectContaining({
                name: 'Juan',
                email: 'juan@test.com',
                role: 'PATIENT'
            })
        )

        consoleSpy.mockRestore()
    })
})
