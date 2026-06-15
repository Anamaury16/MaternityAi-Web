import api, { USE_MOCKS } from './api';

// ---------------------------------------------------------------------------
// Interfaces — alineadas 1:1 con schemas.py del módulo IA
// ---------------------------------------------------------------------------

// ---- Chat ----

export interface ChatMessageRequest {
  mensaje: string;
}

export interface ChatMessage {
  id: string;
  rol: 'user' | 'assistant';
  contenido: string;
  created_at: string;  // datetime ISO
}

export interface ChatHistoryResponse {
  mensajes: ChatMessage[];
  total: number;
}

// ---- Risk Summary ----

export interface RiskSummaryResponse {
  assessment_id: string | null;
  nivel_riesgo: 'verde' | 'amarillo' | 'rojo';
  resumen: string;
  factores_riesgo: string[];
  recomendaciones: string[];
  explicacion_ia: string;
  semana_gestacion: number;
}

// ---- Respuesta genérica ----

export interface DetailResponse {
  detail: string;
}

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockDelay = (ms = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_CHAT_HISTORY: ChatMessage[] = [
  {
    id: 'msg-001',
    rol: 'user',
    contenido: '¿Qué alimentos debo evitar en mi trimestre actual?',
    created_at: '2026-06-15T08:00:00Z',
  },
  {
    id: 'msg-002',
    rol: 'assistant',
    contenido: 'Durante tu semana 28 de gestación, es importante evitar carnes crudas o poco cocidas, huevos crudos, lácteos no pasteurizados y pescados con alto contenido de mercurio. Prioriza frutas bien lavadas, verduras cocidas y fuentes de hierro y calcio. 🩺✨',
    created_at: '2026-06-15T08:00:05Z',
  },
];

const MOCK_RISK_SUMMARY: RiskSummaryResponse = {
  assessment_id: 'risk-001',
  nivel_riesgo: 'verde',
  resumen: 'La gestante presenta un embarazo de evolución favorable sin factores de riesgo significativos.',
  factores_riesgo: ['Ninguno identificado en los controles recientes'],
  recomendaciones: [
    'Continuar con controles prenatales programados',
    'Mantener suplementación diaria de hierro y calcio',
    'Realizar actividad física moderada (caminar 30 min diarios)',
    'Estar atenta a signos de alarma (sangrado, dolor de cabeza intenso)',
  ],
  explicacion_ia: 'Evaluación basada en signos vitales normales (tensión arterial 110/70 mmHg), ganancia de peso adecuada para la edad gestacional y ausencia de antecedentes de hipertensión o diabetes gestacional.',
  semana_gestacion: 28,
};

// ---------------------------------------------------------------------------
// Service Methods
// ---------------------------------------------------------------------------

// POST /api/v1/ia/chat
export const sendChatMessage = async (
  mensaje: string
): Promise<ChatMessage> => {
  if (USE_MOCKS) {
    await mockDelay(2000); // simular latencia de OpenAI
    return {
      id: `msg-${Date.now()}`,
      rol: 'assistant',
      contenido: 'Esta es una respuesta simulada del asistente de IA. Recuerda que la información brindada es educativa y no reemplaza el criterio médico profesional. 🌷',
      created_at: new Date().toISOString(),
    };
  }
  const response = await api.post('/api/v1/ia/chat', { mensaje });
  return response.data;
};

// GET /api/v1/ia/chat/history
export const getChatHistory = async (): Promise<ChatHistoryResponse> => {
  if (USE_MOCKS) {
    await mockDelay();
    return { mensajes: [...MOCK_CHAT_HISTORY], total: MOCK_CHAT_HISTORY.length };
  }
  const response = await api.get('/api/v1/ia/chat/history');
  return response.data;
};

// DELETE /api/v1/ia/chat/history
export const deleteChatHistory = async (): Promise<DetailResponse> => {
  if (USE_MOCKS) {
    await mockDelay();
    return { detail: 'Historial de conversación eliminado exitosamente' };
  }
  const response = await api.delete('/api/v1/ia/chat/history');
  return response.data;
};

// GET /api/v1/ia/risk-summary
export const getRiskSummary = async (): Promise<RiskSummaryResponse> => {
  if (USE_MOCKS) {
    await mockDelay(3000); // simular latencia alta de IA
    return MOCK_RISK_SUMMARY;
  }
  const response = await api.get('/api/v1/ia/risk-summary');
  return response.data;
};
