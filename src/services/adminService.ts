import api from './api';

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

export const uploadExcel = async (file: File): Promise<CargaExcelResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<CargaExcelResponse>(
    '/api/v1/admin/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

export const getHistorialCargas = async (): Promise<CargaExcelResponse[]> => {
  const response = await api.get<CargaExcelResponse[]>('/api/v1/admin/');
  return response.data;
};

export const getDetalleCarga = async (
  cargaId: string
): Promise<CargaExcelDetalleResponse> => {
  const response = await api.get<CargaExcelDetalleResponse>(
    `/api/v1/admin/${cargaId}`
  );
  return response.data;
};
