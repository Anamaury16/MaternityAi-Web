import api, { USE_MOCKS } from './api';

// ---------------------------------------------------------------------------
// Interfaces — alineadas 1:1 con schemas.py del backend
// ---------------------------------------------------------------------------

// ---- Registro ----

export interface GestanteRegisterRequest {
  fecha_nacimiento: string; // date ISO
  fecha_ultima_menstruacion: string; // date ISO
  fecha_probable_parto?: string | null; // date ISO
  anio_ingreso: number;
  tipo_regimen?: string | null;
  nacionalidad_id?: number | null;
  eapb_id?: number | null;
  pertenencia_etnica_id?: number | null;
  grupo_poblacional_id?: number | null;
  fecha_ingreso_cpn?: string | null; // date ISO
  semanas_eg_ingreso?: number | null;
  pregunta_seguridad: string;
  respuesta_seguridad: string;
}

export interface GestanteRegisterResponse {
  codigo_gmi: string;
  mensaje: string;
}

// ---- Perfil Clínico ----

export interface ClinicalProfile {
  enfermedades_cronicas: string | null;
  alergias: string | null;
  habitos: string | null;
  condiciones_riesgo: string | null;
}

// ---- Fórmula Obstétrica ----

export interface ObstetricFormula {
  gestaciones: number;
  partos: number;
  cesareas: number;
  abortos: number;
  vivos: number;
  mortinatos: number;
}

// ---- Antecedentes Patológicos ----

export interface PathologicalHistory {
  id: string;
  tipo_condicion: string;
  descripcion: string | null;
  fecha_diagnostico: string | null; // date ISO
  controlada: boolean | null;
  tratamiento_actual: string | null;
}

export interface PathologicalHistoryRequest {
  tipo_condicion: string;
  descripcion?: string | null;
  fecha_diagnostico?: string | null; // date ISO
  controlada?: boolean | null;
  tratamiento_actual?: string | null;
}

// ---- Consentimiento Informado ----

export interface ConsentRequest {
  version: string;
  hash_consentimiento: string;
}

export interface ConsentResponse {
  id: string;
  version: string;
  estado: string; // "ACEPTADO" | "REVOCADO"
  fecha_aceptacion: string;
}

// ---- Edad Gestacional ----

export interface GestationalAge {
  semanas: number;
  dias: number;
  descripcion: string;
  fecha_ultima_menstruacion: string; // date ISO
  fecha_probable_parto: string | null; // date ISO
}

// ---- Módulo Activo ----

export interface ActiveModule {
  modulo_id: number;
  codigo: string;
  nombre: string;
  semana_gestacion_actual: number;
}

// ---- Historial de Módulo ----

export interface ModuleHistoryEntry {
  id: string;
  modulo_anterior: string | null;
  modulo_nuevo: string;
  motivo: string | null;
  origen: string | null;
  created_at: string;
}

// ---- Pregunta de Seguridad ----

export interface SecurityQuestionRequest {
  pregunta: string;
  respuesta: string;
}

// ---- Respuesta genérica de detalle ----

export interface DetailResponse {
  detail: string;
}

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockDelay = (ms = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_CLINICAL_PROFILE: ClinicalProfile = {
  enfermedades_cronicas: 'Ninguna conocida',
  alergias: 'Penicilina',
  habitos: 'No fuma, no bebe alcohol',
  condiciones_riesgo: 'Ninguna',
};

const MOCK_OBSTETRIC_FORMULA: ObstetricFormula = {
  gestaciones: 2,
  partos: 1,
  cesareas: 0,
  abortos: 0,
  vivos: 1,
  mortinatos: 0,
};

const MOCK_PATHOLOGICAL_HISTORY: PathologicalHistory[] = [
  {
    id: 'ant-001',
    tipo_condicion: 'Diabetes Gestacional',
    descripcion: 'Detectada en embarazo anterior',
    fecha_diagnostico: '2022-05-10',
    controlada: true,
    tratamiento_actual: 'Dieta controlada',
  },
  {
    id: 'ant-002',
    tipo_condicion: 'Hipertensión',
    descripcion: null,
    fecha_diagnostico: '2023-01-20',
    controlada: false,
    tratamiento_actual: 'Losartán 50mg',
  },
];

const MOCK_CONSENT: ConsentResponse = {
  id: 'cons-001',
  version: 'v1.0',
  estado: 'ACEPTADO',
  fecha_aceptacion: '2024-03-01T10:00:00',
};

const MOCK_GESTATIONAL_AGE: GestationalAge = {
  semanas: 12,
  dias: 3,
  descripcion: '12 semanas y 3 días de gestación',
  fecha_ultima_menstruacion: '2024-02-15',
  fecha_probable_parto: '2024-11-22',
};

const MOCK_ACTIVE_MODULE: ActiveModule = {
  modulo_id: 1,
  codigo: 'M0',
  nombre: 'Registro y Perfil',
  semana_gestacion_actual: 12,
};

const MOCK_MODULE_HISTORY: ModuleHistoryEntry[] = [
  {
    id: 'hist-001',
    modulo_anterior: null,
    modulo_nuevo: 'M0',
    motivo: 'Registro inicial',
    origen: 'sistema',
    created_at: '2024-03-01T08:00:00',
  },
  {
    id: 'hist-002',
    modulo_anterior: 'M0',
    modulo_nuevo: 'M1',
    motivo: 'Avance de edad gestacional',
    origen: 'sistema',
    created_at: '2024-05-10T08:00:00',
  },
];

// ---------------------------------------------------------------------------
// Service Methods
// ---------------------------------------------------------------------------

// POST /api/v1/m0/register
export const registerGestante = async (
  data: GestanteRegisterRequest
): Promise<GestanteRegisterResponse> => {
  if (USE_MOCKS) {
    await mockDelay();
    return {
      codigo_gmi: 'GMI-2024-0001',
      mensaje: 'Gestante registrada exitosamente',
    };
  }
  const response = await api.post('/api/v1/m0/register', data);
  return response.data;
};

// GET /api/v1/m0/profile/clinical
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
        enfermedades_cronicas: '',
        alergias: '',
        habitos: '',
        condiciones_riesgo: '',
      };
    }
    throw error;
  }
};

// PUT /api/v1/m0/profile/clinical
export const updateClinicalProfile = async (
  data: Partial<ClinicalProfile>
): Promise<ClinicalProfile> => {
  if (USE_MOCKS) {
    await mockDelay();
    return { ...MOCK_CLINICAL_PROFILE, ...data };
  }
  const response = await api.put('/api/v1/m0/profile/clinical', data);
  return response.data;
};

// GET /api/v1/m0/profile/obstetric-formula
export const getObstetricFormula = async (): Promise<ObstetricFormula> => {
  if (USE_MOCKS) {
    await mockDelay();
    return MOCK_OBSTETRIC_FORMULA;
  }
  const response = await api.get('/api/v1/m0/profile/obstetric-formula');
  return response.data;
};

// PUT /api/v1/m0/profile/obstetric-formula
// Nota: el backend recibe todos los campos como requeridos (ObstetricFormulaUpdate),
// y valida que gestaciones >= partos + cesareas + abortos
export const updateObstetricFormula = async (
  data: ObstetricFormula
): Promise<ObstetricFormula> => {
  if (USE_MOCKS) {
    await mockDelay();
    return { ...MOCK_OBSTETRIC_FORMULA, ...data };
  }
  const response = await api.put('/api/v1/m0/profile/obstetric-formula', data);
  return response.data;
};

// GET /api/v1/m0/profile/pathological-history
export const getPathologicalHistory = async (): Promise<
  PathologicalHistory[]
> => {
  if (USE_MOCKS) {
    await mockDelay();
    return MOCK_PATHOLOGICAL_HISTORY;
  }
  const response = await api.get('/api/v1/m0/profile/pathological-history');
  return response.data;
};

// POST /api/v1/m0/profile/pathological-history  — status 201
export const createPathologicalHistory = async (
  data: PathologicalHistoryRequest
): Promise<PathologicalHistory> => {
  if (USE_MOCKS) {
    await mockDelay();
    return {
      id: `ant-${Date.now()}`,
      tipo_condicion: data.tipo_condicion,
      descripcion: data.descripcion ?? null,
      fecha_diagnostico: data.fecha_diagnostico ?? null,
      controlada: data.controlada ?? null,
      tratamiento_actual: data.tratamiento_actual ?? null,
    };
  }
  const response = await api.post(
    '/api/v1/m0/profile/pathological-history',
    data
  );
  return response.data;
};

// PUT /api/v1/m0/profile/pathological-history/{antecedente_id}
export const updatePathologicalHistory = async (
  antecedente_id: string,
  data: Partial<PathologicalHistoryRequest>
): Promise<PathologicalHistory> => {
  if (USE_MOCKS) {
    await mockDelay();
    const existing =
      MOCK_PATHOLOGICAL_HISTORY.find((a) => a.id === antecedente_id) ??
      MOCK_PATHOLOGICAL_HISTORY[0];
    return { ...existing, ...data, id: antecedente_id };
  }
  const response = await api.put(
    `/api/v1/m0/profile/pathological-history/${antecedente_id}`,
    data
  );
  return response.data;
};

// DELETE /api/v1/m0/profile/pathological-history/{antecedente_id}  — status 204
export const deletePathologicalHistory = async (
  antecedente_id: string
): Promise<void> => {
  if (USE_MOCKS) {
    await mockDelay();
    return;
  }
  await api.delete(`/api/v1/m0/profile/pathological-history/${antecedente_id}`);
};

// GET /api/v1/m0/consent
export const getConsent = async (): Promise<ConsentResponse> => {
  if (USE_MOCKS) {
    await mockDelay();
    return MOCK_CONSENT;
  }
  const response = await api.get('/api/v1/m0/consent');
  return response.data;
};

// POST /api/v1/m0/consent  — status 201
export const registerConsent = async (
  data: ConsentRequest
): Promise<ConsentResponse> => {
  if (USE_MOCKS) {
    await mockDelay();
    return {
      id: `cons-${Date.now()}`,
      version: data.version,
      estado: 'ACEPTADO',
      fecha_aceptacion: new Date().toISOString(),
    };
  }
  const response = await api.post('/api/v1/m0/consent', data);
  return response.data;
};

// POST /api/v1/m0/consent/revoke
export const revokeConsent = async (): Promise<DetailResponse> => {
  if (USE_MOCKS) {
    await mockDelay();
    return { detail: 'Consentimiento informado revocado exitosamente' };
  }
  const response = await api.post('/api/v1/m0/consent/revoke');
  return response.data;
};

// GET /api/v1/m0/consent/document
// El router actual retorna { detail: "Endpoint pendiente de implementación" }
// Cuando esté listo será un Blob (PDF). Por ahora tipado como unknown.
export const getConsentDocument = async (): Promise<unknown> => {
  if (USE_MOCKS) {
    await mockDelay();
    return { detail: 'Endpoint pendiente de implementación' };
  }
  const response = await api.get('/api/v1/m0/consent/document', {
    responseType: 'blob',
  });
  return response.data;
};

// GET /api/v1/m0/gestational-age
export const getGestationalAge = async (): Promise<GestationalAge> => {
  if (USE_MOCKS) {
    await mockDelay();
    return MOCK_GESTATIONAL_AGE;
  }
  const response = await api.get('/api/v1/m0/gestational-age');
  return response.data;
};

// GET /api/v1/m0/active-module
export const getActiveModule = async (): Promise<ActiveModule> => {
  if (USE_MOCKS) {
    await mockDelay();
    return MOCK_ACTIVE_MODULE;
  }
  const response = await api.get('/api/v1/m0/active-module');
  return response.data;
};

// GET /api/v1/m0/module-history
export const getModuleHistory = async (): Promise<ModuleHistoryEntry[]> => {
  if (USE_MOCKS) {
    await mockDelay();
    return MOCK_MODULE_HISTORY;
  }
  const response = await api.get('/api/v1/m0/module-history');
  return response.data;
};

// PUT /api/v1/m0/security-question
// Nota: el backend usa { pregunta, respuesta } — no pregunta_seguridad/respuesta_seguridad
export const updateSecurityQuestion = async (
  data: SecurityQuestionRequest
): Promise<DetailResponse> => {
  if (USE_MOCKS) {
    await mockDelay();
    return { detail: 'Pregunta de seguridad actualizada exitosamente' };
  }
  const response = await api.put('/api/v1/m0/security-question', data);
  return response.data;
};

// DELETE /api/v1/m0/account
export const deleteAccount = async (): Promise<DetailResponse> => {
  if (USE_MOCKS) {
    await mockDelay();
    return {
      detail:
        'Cuenta desactivada exitosamente. Los datos serán eliminados según la política de retención.',
    };
  }
  const response = await api.delete('/api/v1/m0/account');
  return response.data;
};
