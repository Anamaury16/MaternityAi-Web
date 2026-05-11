import api, { USE_MOCKS } from './api';

// --- Interfaces ---

export interface GestanteRegisterRequest {
  fecha_nacimiento: string;
  fecha_ultima_menstruacion: string;
  anio_ingreso: number;
  pregunta_seguridad: string;
  respuesta_seguridad: string;
  tipo_regimen?: string;
  nacionalidad_id?: number;
  eapb_id?: number;
}

export interface ClinicalProfile {
  enfermedades_cronicas: string | null;
  alergias: string | null;
  habitos: string | null;
  condiciones_riesgo: string | null;
}

export interface ObstetricFormula {
  gestaciones: number;
  partos: number;
  cesareas: number;
  abortos: number;
  vivos: number;
  mortinatos: number;
}

export interface PathologicalHistory {
  id: string;
  tipo_condicion: string;
  descripcion: string | null;
  fecha_diagnostico: string | null;
  controlada: boolean | null;
  tratamiento_actual: string | null;
}

// --- Mocks ---

const mockDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_CLINICAL_PROFILE: ClinicalProfile = {
  enfermedades_cronicas: "Ninguna conocida",
  alergias: "Penicilina",
  habitos: "No fuma, no bebe alcohol",
  condiciones_riesgo: "Ninguna"
};

const MOCK_OBSTETRIC_FORMULA: ObstetricFormula = {
  gestaciones: 2,
  partos: 1,
  cesareas: 0,
  abortos: 0,
  vivos: 1,
  mortinatos: 0
};

// --- Service Methods ---

export const registerGestante = async (data: GestanteRegisterRequest) => {
  if (USE_MOCKS) {
    await mockDelay();
    return { codigo_gmi: "GMI-12345", mensaje: "Gestante registrada exitosamente (MOCK)" };
  }
  const response = await api.post('/api/v1/m0/register', data);
  return response.data;
};

export const getClinicalProfile = async (): Promise<ClinicalProfile> => {
  if (USE_MOCKS) {
    await mockDelay();
    return MOCK_CLINICAL_PROFILE;
  }
  const response = await api.get('/api/v1/m0/profile/clinical');
  return response.data;
};

export const updateClinicalProfile = async (data: Partial<ClinicalProfile>) => {
  if (USE_MOCKS) {
    await mockDelay();
    return { ...MOCK_CLINICAL_PROFILE, ...data };
  }
  const response = await api.put('/api/v1/m0/profile/clinical', data);
  return response.data;
};

export const getObstetricFormula = async (): Promise<ObstetricFormula> => {
  if (USE_MOCKS) {
    await mockDelay();
    return MOCK_OBSTETRIC_FORMULA;
  }
  const response = await api.get('/api/v1/m0/profile/obstetric-formula');
  return response.data;
};

export const getGestationalAge = async () => {
  if (USE_MOCKS) {
    await mockDelay();
    return {
      semanas: 12,
      dias: 3,
      descripcion: "12 semanas y 3 días de gestación",
      fecha_ultima_menstruacion: "2024-02-15",
      fecha_probable_parto: "2024-11-22"
    };
  }
  const response = await api.get('/api/v1/m0/gestational-age');
  return response.data;
};

export const getActiveModule = async () => {
  if (USE_MOCKS) {
    await mockDelay();
    return {
      modulo_id: 1,
      codigo: "M0",
      nombre: "Registro y Perfil",
      semana_gestacion_actual: 12
    };
  }
  const response = await api.get('/api/v1/m0/active-module');
  return response.data;
};
