import api from './api';

export const getMyMedicos = async (patientId) => {

    const response = await api.get(`/api/relationships/paciente/${patientId}/medicos`);
    return response.data;
};

export const getMyPacientes = async (medicoId) => {
    const response = await api.get(`/api/relationships/medico/${medicoId}/pacientes`);
    return response.data;
};

export const assignPatientToProfessional = async (patientId, medicoId) => {
    const response = await api.post('/api/relationships/assign', { patientId, medicoId });
    return response.data;
};