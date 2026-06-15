import api from './api';

// ─── Catálogos ───────────────────────────────────────────────────────────────

export interface CatalogoItem {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
}

export interface Catalogos {
  nacionalidades: CatalogoItem[];
  eapbs: CatalogoItem[];
  pertenencias_etnicas: CatalogoItem[];
  grupos_poblacionales: CatalogoItem[];
}

export const getCatalogos = async (): Promise<Catalogos> => {
  const [nac, eapb, etnica, grupo] = await Promise.all([
    api.get<CatalogoItem[]>('/api/v1/admin/catalogs/nacionalidad', { params: { size: 100 } }),
    api.get<CatalogoItem[]>('/api/v1/admin/catalogs/eapb', { params: { size: 100 } }),
    api.get<CatalogoItem[]>('/api/v1/admin/catalogs/pertenencia-etnica', { params: { size: 100 } }),
    api.get<CatalogoItem[]>('/api/v1/admin/catalogs/grupo-poblacional', { params: { size: 100 } }),
  ]);
  return {
    nacionalidades:       nac.data,
    eapbs:                eapb.data,
    pertenencias_etnicas: etnica.data,
    grupos_poblacionales: grupo.data,
  };
};


export interface CargaDetalleResponse {
  fila_numero: number;
  hoja: string;
  estado: string;
  mensaje_error: string | null;
}

export interface CargaExcelResponse {
  id: string;
  archivo_nombre: string;
  estado: string;
  total_gestantes: number | null;
  nuevas: number | null;
  actualizadas: number | null;
  errores: number | null;
  created_at: string | null;
}

export interface CargaExcelDetalleResponse extends CargaExcelResponse {
  detalles: CargaDetalleResponse[];
}

// ─── Staff User ──────────────────────────────────────────────────────────────

export interface StaffUserCreate {
  email: string;
  nombre: string;
  rol_id: number;
  password: string;
}

export interface StaffUserUpdate {
  nombre: string;
  rol_id: number;
}

export interface StaffUserResponse {
  id: string;
  email: string;
  nombre: string;
  rol_id: string;
  activo: boolean;
  created_at: string | null;
}

export interface StaffListParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface RoleOption {
  id: number;
  nombre: string;
}

export const getRoles = async (): Promise<RoleOption[]> => {
  const response = await api.get<RoleOption[]>('/api/v1/admin/roles');
  return response.data;
};

export const getStaffUsers = async (
  params: StaffListParams = {}
): Promise<StaffUserResponse[]> => {
  const response = await api.get<StaffUserResponse[]>('/api/v1/admin/users', {
    params: { page: 1, size: 20, sort: 'fecha_desc', ...params },
  });
  return response.data;
};

export const createStaffUser = async (
  data: StaffUserCreate
): Promise<StaffUserResponse> => {
  const response = await api.post<StaffUserResponse>('/api/v1/admin/users', data);
  return response.data;
};

export const updateStaffUser = async (
  userId: string,
  data: StaffUserUpdate
): Promise<StaffUserResponse> => {
  const response = await api.put<StaffUserResponse>(
    `/api/v1/admin/users/${userId}`,
    data
  );
  return response.data;
};

export const updateStaffStatus = async (
  userId: string,
  activo: boolean
): Promise<StaffUserResponse> => {
  const response = await api.patch<StaffUserResponse>(
    `/api/v1/admin/users/${userId}/status`,
    { activo }
  );
  return response.data;
};

// ─── Gestantes ───────────────────────────────────────────────────────────────

export interface GestanteResponse {
  id: string;
  codigo_gmi: string;
  fecha_nacimiento?: string | null;
  fecha_ultima_menstruacion?: string | null;
  fecha_probable_parto?: string | null;
  semanas_eg_ingreso?: number | null;
  modulo_activo_id?: number | null;
  activa: boolean;
  anio_ingreso?: number | null;
  created_at: string | null;
  ultimo_acceso?: string | null;
  ultima_pregunta_respondida?: string | null;
  ultima_respuesta_fecha?: string | null;
  ultimo_estado_alerta?: string | null;
  ultima_prioridad_alerta_id?: number | null;
  nivel_riesgo?: string | null;
  clasificacion_ia?: string | null;
}

export const getGestantes = async (
  params: { page?: number; size?: number; sort?: string } = {}
): Promise<GestanteResponse[]> => {
  const response = await api.get<GestanteResponse[]>('/api/v1/admin/gestantes', {
    params: { page: 1, size: 100, sort: 'fecha_desc', ...params },
  });
  return response.data;
};

// ─── Cargas ──────────────────────────────────────────────────────────────────

export const uploadExcel = async (file: File): Promise<CargaExcelResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<CargaExcelResponse>(
    '/api/v1/admin/upload/gestantes',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
};

export const getHistorialCargas = async (): Promise<CargaExcelResponse[]> => {
  const response = await api.get('/api/v1/admin/upload/gestantes/history');
  return response.data;
};

export const getDetalleCarga = async (
  cargaId: string
): Promise<CargaExcelDetalleResponse> => {
  const response = await api.get<CargaExcelDetalleResponse>(
    `/api/v1/admin/upload/gestantes/${cargaId}/detail`
  );
  return response.data;
};

// ─── Catálogos CRUD ───────────────────────────────────────────────────────────

export interface CatalogItemCreate {
  codigo?: string;
  nombre: string;
  descripcion?: string | null;
  activo?: boolean;
}

export interface CatalogItemUpdate {
  codigo?: string;
  nombre?: string;
  descripcion?: string | null;
}

export const getCatalogItems = async (
  catalogName: string,
  params: { page?: number; size?: number } = {}
): Promise<CatalogoItem[]> => {
  const response = await api.get<CatalogoItem[]>(
    `/api/v1/admin/catalogs/${catalogName}`,
    { params: { page: 1, size: 100, ...params } }
  );
  return response.data;
};

export const createCatalogItem = async (
  catalogName: string,
  data: CatalogItemCreate
): Promise<CatalogoItem> => {
  const response = await api.post<CatalogoItem>(
    `/api/v1/admin/catalogs/${catalogName}`,
    data
  );
  return response.data;
};

export const updateCatalogItem = async (
  catalogName: string,
  id: string | number,
  data: CatalogItemUpdate
): Promise<CatalogoItem> => {
  const response = await api.put<CatalogoItem>(
    `/api/v1/admin/catalogs/${catalogName}/${id}`,
    data
  );
  return response.data;
};

export const updateCatalogStatus = async (
  catalogName: string,
  id: string | number,
  activo: boolean
): Promise<CatalogoItem> => {
  const response = await api.patch<CatalogoItem>(
    `/api/v1/admin/catalogs/${catalogName}/${id}/status`,
    { activo }
  );
  return response.data;
};

// ─── Contenido Educativo y Categorías ────────────────────────────────────────

export interface EducationalCategoryCreate {
  nombre: string;
  descripcion?: string | null;
  icono?: string | null;
  orden?: number | null;
}

export interface EducationalCategoryUpdate {
  nombre?: string;
  descripcion?: string | null;
  icono?: string | null;
  orden?: number | null;
}

export interface EducationalCategoryResponse {
  id: number;
  nombre: string;
  descripcion?: string | null;
  icono?: string | null;
  orden?: number | null;
  activo: boolean;
}

export interface EducationalContentCreate {
  categoria_id?: number | null;
  titulo: string;
  descripcion?: string | null;
  tipo_contenido?: string | null; // e.g. 'VIDEO' o 'ARTICULO' or 'ARTÍCULO'
  cuerpo_texto?: string | null;
  url_recurso?: string | null;
  url_imagen?: string | null;
  modulo_id?: number | null;
  semana_eg_inicio?: number | null;
  semana_eg_fin?: number | null;
  duracion_minutos?: number | null;
  orden?: number | null;
}

export interface EducationalContentUpdate {
  categoria_id?: number | null;
  titulo?: string;
  descripcion?: string | null;
  tipo_contenido?: string | null;
  cuerpo_texto?: string | null;
  url_recurso?: string | null;
  url_imagen?: string | null;
  modulo_id?: number | null;
  semana_eg_inicio?: number | null;
  semana_eg_fin?: number | null;
  duracion_minutos?: number | null;
  orden?: number | null;
}

export interface EducationalContentResponse {
  id: number;
  categoria_id?: number | null;
  titulo: string;
  descripcion?: string | null;
  tipo_contenido?: string | null;
  cuerpo_texto?: string | null;
  url_recurso?: string | null;
  url_imagen?: string | null;
  modulo_id?: number | null;
  semana_eg_inicio?: number | null;
  semana_eg_fin?: number | null;
  duracion_minutos?: number | null;
  orden?: number | null;
  activo: boolean;
}

export const getEducationalCategories = async (
  params: { page?: number; size?: number; sort?: string } = {}
): Promise<EducationalCategoryResponse[]> => {
  const response = await api.get<EducationalCategoryResponse[]>('/api/v1/admin/educational-categories', {
    params: { page: 1, size: 100, sort: 'orden_asc', ...params },
  });
  return response.data;
};

export const createEducationalCategory = async (
  data: EducationalCategoryCreate
): Promise<EducationalCategoryResponse> => {
  const response = await api.post<EducationalCategoryResponse>('/api/v1/admin/educational-categories', data);
  return response.data;
};

export const updateEducationalCategory = async (
  id: number,
  data: EducationalCategoryUpdate
): Promise<EducationalCategoryResponse> => {
  const response = await api.put<EducationalCategoryResponse>(`/api/v1/admin/educational-categories/${id}`, data);
  return response.data;
};

export const getEducationalContents = async (
  params: { page?: number; size?: number; sort?: string } = {}
): Promise<EducationalContentResponse[]> => {
  const response = await api.get<EducationalContentResponse[]>('/api/v1/admin/educational-content', {
    params: { page: 1, size: 100, sort: 'orden_asc', ...params },
  });
  return response.data;
};

export const createEducationalContent = async (
  data: EducationalContentCreate
): Promise<EducationalContentResponse> => {
  const response = await api.post<EducationalContentResponse>('/api/v1/admin/educational-content', data);
  return response.data;
};

export const updateEducationalContent = async (
  id: number,
  data: EducationalContentUpdate
): Promise<EducationalContentResponse> => {
  const response = await api.put<EducationalContentResponse>(`/api/v1/admin/educational-content/${id}`, data);
  return response.data;
};

export const updateEducationalContentStatus = async (
  id: number,
  activo: boolean
): Promise<EducationalContentResponse> => {
  const response = await api.patch<EducationalContentResponse>(
    `/api/v1/admin/educational-content/${id}/status`,
    { activo }
  );
  return response.data;
};

// ─── Preguntas de Seguimiento ────────────────────────────────────────────────

export interface FollowUpQuestionCreate {
  texto_pregunta: string;
  tipo_respuesta: string;
  modulo_id?: number | null;
  frecuencia?: string | null;
  es_signo_alarma?: boolean;
  prioridad_alerta_default_id?: number | null;
  orden?: number | null;
}

export interface FollowUpQuestionUpdate {
  texto_pregunta?: string;
  tipo_respuesta?: string;
  modulo_id?: number | null;
  frecuencia?: string | null;
  es_signo_alarma?: boolean;
  prioridad_alerta_default_id?: number | null;
  orden?: number | null;
}

export interface FollowUpQuestionResponse {
  id: number;
  texto_pregunta: string;
  tipo_respuesta: string;
  modulo_id?: number | null;
  frecuencia?: string | null;
  es_signo_alarma: boolean;
  prioridad_alerta_default_id?: number | null;
  orden?: number | null;
  activo: boolean;
}

export const getFollowUpQuestions = async (
  params: { page?: number; size?: number; sort?: string } = {}
): Promise<FollowUpQuestionResponse[]> => {
  const response = await api.get<FollowUpQuestionResponse[]>('/api/v1/admin/follow-up-questions', {
    params: { page: 1, size: 100, sort: 'fecha_desc', ...params },
  });
  return response.data;
};

export const createFollowUpQuestion = async (
  data: FollowUpQuestionCreate
): Promise<FollowUpQuestionResponse> => {
  const response = await api.post<FollowUpQuestionResponse>('/api/v1/admin/follow-up-questions', data);
  return response.data;
};

export const updateFollowUpQuestion = async (
  id: number,
  data: FollowUpQuestionUpdate
): Promise<FollowUpQuestionResponse> => {
  const response = await api.put<FollowUpQuestionResponse>(`/api/v1/admin/follow-up-questions/${id}`, data);
  return response.data;
};

export const updateFollowUpQuestionStatus = async (
  id: number,
  activo: boolean
): Promise<FollowUpQuestionResponse> => {
  const response = await api.patch<FollowUpQuestionResponse>(
    `/api/v1/admin/follow-up-questions/${id}/status`,
    { activo }
  );
  return response.data;
};