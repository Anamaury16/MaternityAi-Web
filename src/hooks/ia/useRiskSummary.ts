import { useState, useEffect, useCallback } from 'react';
import { getRiskSummary, type RiskSummaryResponse } from '../../services/iaService';

const SESSION_CACHE_KEY = 'gmi_risk_summary_cache';

export const useRiskSummary = () => {
  const [summary, setSummary] = useState<RiskSummaryResponse | null>(() => {
    // Intentar inicializar con datos cacheados de la sesión actual
    const cached = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Error parsing risk summary cache:', e);
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async (forceUpdate = false) => {
    // Si ya tenemos datos cacheados y no se fuerza la actualización, no hacemos nada
    if (summary && !forceUpdate) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await getRiskSummary();
      setSummary(response);
      sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(response));
    } catch (err: any) {
      console.error('Error fetching risk summary:', err);
      setError(
        err.response?.data?.detail || 'No se pudo generar el resumen de riesgo.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [summary]);

  // Carga inicial (respeta caché si existe)
  useEffect(() => {
    loadSummary(false);
  }, []);

  return {
    summary,
    isLoading,
    error,
    updateEvaluation: () => loadSummary(true),
  };
};
