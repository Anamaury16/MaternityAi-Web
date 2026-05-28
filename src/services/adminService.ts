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
    api.get<CatalogoItem[]>('/api/v1/admin/catalogs/nacionalidades'),
    api.get<CatalogoItem[]>('/api/v1/admin/catalogs/eapbs'),
    api.get<CatalogoItem[]>('/api/v1/admin/catalogs/pertenencias-etnicas'),
    api.get<CatalogoItem[]>('/api/v1/admin/catalogs/grupos-poblacionales'),
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