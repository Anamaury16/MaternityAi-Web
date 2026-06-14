import api, { USE_MOCKS } from './api';

// --- Interfaces ---

export interface GestanteRegisterRequest {
  fecha_nacimiento: string;
  fecha_ultima_menstruacion: string;
  anio_ingreso: number;
  pregunta_seguridad: string;
  respuesta_seguridad: string;
  tipo_regimen?: string;
  // Catálogo — modo selector (ID)
  nacionalidad_id?: string;
  eapb_id?: string;
  pertenencia_etnica_id?: string;
  grupo_poblacional_id?: string;
  // Catálogo — modo texto libre
  nacionalidad_texto?: string;
  eapb_texto?: string;
  pertenencia_etnica_texto?: string;
  grupo_poblacional_texto?: string;
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

const MOCK_PATHOLOGICAL_HISTORY: PathologicalHistory[] = [
  {
    id: "a9b8c7d6-e5f4-4321-b012-3456789abcde",
    tipo_condicion: "Crónica",
    descripcion: "Hipertensión arterial preexistente",
    fecha_diagnostico: "2024-01-15",
    controlada: true,
    tratamiento_actual: "Metildopa 250mg cada 8 horas"
  }
];


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
  try {
    const response = await api.get('/api/v1/m0/profile/clinical');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return {
        enfermedades_cronicas: "",
        alergias: "",
        habitos: "",
        condiciones_riesgo: ""
      };
    }
    throw error;
  }
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
  try {
    const response = await api.get('/api/v1/m0/profile/obstetric-formula');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return {
        gestaciones: 0,
        partos: 0,
        cesareas: 0,
        abortos: 0,
        vivos: 0,
        mortinatos: 0
      };
    }
    throw error;
  }
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
  try {
    const response = await api.get('/api/v1/m0/gestational-age');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export interface ModuleHistory {
  id: string;
  modulo_anterior: string | null;
  modulo_nuevo: string;
  motivo: string;
  origen: string;
  created_at: string;
}

const MOCK_MODULE_HISTORY: ModuleHistory[] = [
  {
    id: "4918ddbb-e79b-4904-8ff2-a6a85b565ee9",
    modulo_anterior: null,
    modulo_nuevo: "M4",
    motivo: "Avance de edad gestacional",
    origen: "sistema",
    created_at: "2026-06-09 12:45:33"
  }
];

export const getActiveModule = async () => {
  if (USE_MOCKS) {
    await mockDelay();
    return {
      modulo_id: 4,
      codigo: "M4",
      nombre: "Puerperio",
      semana_gestacion_actual: 161
    };
  }
  try {
    const response = await api.get('/api/v1/m0/active-module');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const getModuleHistory = async (): Promise<ModuleHistory[]> => {
  if (USE_MOCKS) {
    await mockDelay();
    return MOCK_MODULE_HISTORY;
  }
  try {
    const response = await api.get('/api/v1/m0/module-history');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const getPathologicalHistory = async (): Promise<PathologicalHistory[]> => {
  if (USE_MOCKS) {
    await mockDelay();
    return MOCK_PATHOLOGICAL_HISTORY;
  }
  try {
    const response = await api.get('/api/v1/m0/profile/pathological-history');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export interface SecurityQuestionUpdatePayload {
  pregunta: string;
  workspace?: string;
  respuesta: string;
}

export const updateSecurityQuestion = async (data: SecurityQuestionUpdatePayload) => {
  if (USE_MOCKS) {
    await mockDelay();
    return { mensaje: "Pregunta de seguridad actualizada exitosamente (MOCK)" };
  }
  const response = await api.put('/api/v1/m0/security-question', data);
  return response.data;
};

export const deleteAccount = async () => {
  if (USE_MOCKS) {
    await mockDelay();
    return { mensaje: "Cuenta y datos eliminados exitosamente (MOCK)" };
  }
  const response = await api.delete('/api/v1/m0/account');
  return response.data;
};


// --- Checklist de Progreso ---

export interface ChecklistItem {
  id: number;
  texto: string;
  modulo_id: number | null;
  semana_eg: number | null;
  orden: number | null;
  activo: boolean;
}

const MOCK_CHECKLIST: Record<string, ChecklistItem[]> = {
  M1: [
    { id: 1, texto: 'Primer control prenatal realizado', modulo_id: 1, semana_eg: null, orden: 1, activo: true },
    { id: 2, texto: 'Ácido fólico iniciado', modulo_id: 1, semana_eg: null, orden: 2, activo: true },
    { id: 3, texto: 'Exámenes de laboratorio iniciales', modulo_id: 1, semana_eg: null, orden: 3, activo: false },
    { id: 4, texto: 'Ecografía del primer trimestre', modulo_id: 1, semana_eg: 12, orden: 4, activo: false },
  ],
  M2: [
    { id: 5, texto: 'Control prenatal semana 16-20', modulo_id: 2, semana_eg: null, orden: 1, activo: true },
    { id: 6, texto: 'Vacuna influenza aplicada', modulo_id: 2, semana_eg: null, orden: 2, activo: false },
    { id: 7, texto: 'Vacuna tosferina aplicada', modulo_id: 2, semana_eg: null, orden: 3, activo: false },
    { id: 8, texto: 'Ecografía morfológica', modulo_id: 2, semana_eg: 20, orden: 4, activo: true },
    { id: 9, texto: 'Hierro y calcio suministrados', modulo_id: 2, semana_eg: null, orden: 5, activo: false },
  ],
  M3: [
    { id: 10, texto: 'Plan de parto elaborado', modulo_id: 3, semana_eg: null, orden: 1, activo: false },
    { id: 11, texto: 'Control semana 28-32', modulo_id: 3, semana_eg: null, orden: 2, activo: true },
    { id: 12, texto: 'Bolsa de maternidad lista', modulo_id: 3, semana_eg: 36, orden: 3, activo: false },
    { id: 13, texto: 'Conteo de movimientos fetales iniciado', modulo_id: 3, semana_eg: null, orden: 4, activo: true },
    { id: 14, texto: 'IPS de atención identificada', modulo_id: 3, semana_eg: null, orden: 5, activo: false },
  ],
  M4: [
    { id: 15, texto: 'Control posparto semana 1', modulo_id: 4, semana_eg: null, orden: 1, activo: true },
    { id: 16, texto: 'Orientación lactancia materna', modulo_id: 4, semana_eg: null, orden: 2, activo: true },
    { id: 17, texto: 'Método anticonceptivo definido', modulo_id: 4, semana_eg: null, orden: 3, activo: false },
    { id: 18, texto: 'Control posparto semana 6', modulo_id: 4, semana_eg: null, orden: 4, activo: false },
  ],
};

export const getChecklistForGestante = async (moduloId: number, moduloCodigo: string): Promise<ChecklistItem[]> => {
  if (USE_MOCKS) {
    await mockDelay(600);
    return MOCK_CHECKLIST[moduloCodigo] ?? [];
  }
  try {
    const response = await api.get<ChecklistItem[]>('/api/v1/clinical/checklist-items', {
      params: { modulo_id: moduloId },
    });
    return response.data;
  } catch {
    // Fallback a mocks si el endpoint falla
    return MOCK_CHECKLIST[moduloCodigo] ?? [];
  }
};
