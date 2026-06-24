import { useEffect, useRef, useState } from 'react';
import styles from './ChatIA.module.css';
import { type ChatMessage } from '../../../../services/iaService';
import {
  parseMarkdown,
  formatOutgoingMessage,
  getQuickSuggestions,
} from '../../../../utils/iaHelpers';
import { useTriage } from '../../../../hooks/ia/useTriage';

const URGENCY_LABELS: Record<string, string> = {
  inmediata: 'Inmediata',
  urgente: 'Urgente',
  no_urgente: 'No urgente',
};

interface ChatIAProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  clearHistory?: () => Promise<boolean>;
  activeTopicTag: string;
}

export const ChatIA = ({
  messages,
  isLoading,
  isSending,
  error,
  sendMessage,
  clearHistory,
  activeTopicTag,
}: ChatIAProps) => {
  const [inputText, setInputText] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSymptomPanel, setShowSymptomPanel] = useState(false);
  const [symptomsText, setSymptomsText] = useState('');
  const chatsContainerRef = useRef<HTMLDivElement>(null);
  const triage = useTriage();

  // Auto-scroll al final del contenedor de chats sin afectar el viewport global
  useEffect(() => {
    if (chatsContainerRef.current) {
      chatsContainerRef.current.scrollTop = chatsContainerRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const text = inputText;
    setInputText(''); // Limpiar input inmediatamente (optimistic UX)
    const formattedText = formatOutgoingMessage(text, activeTopicTag);
    await sendMessage(formattedText);
  };

  const handleToggleSymptomPanel = () => {
    if (showSymptomPanel) {
      setSymptomsText('');
    }
    setShowSymptomPanel((prev) => !prev);
  };

  const handleRunTriage = async () => {
    const sintomas = symptomsText
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (sintomas.length === 0) return;

    await triage.runTriage(sintomas);
    setShowSymptomPanel(false);
    setSymptomsText('');
  };

  const handleDeleteClick = async () => {
    if (!clearHistory) return;
    setIsDeleting(true);
    try {
      const success = await clearHistory();
      if (success) {
        setConfirmingDelete(false);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className={styles.contenedor1}>
      {/* Header del Chat */}
      <div className={styles.chatHeader}>
        {confirmingDelete ? (
          <div className={styles.headerConfirm}>
            <span>¿Borrar historial?</span>
            <button className={styles.confirmYesBtn} onClick={handleDeleteClick} disabled={isDeleting}>
              {isDeleting ? '...' : 'Sí'}
            </button>
            <button className={styles.confirmNoBtn} onClick={() => setConfirmingDelete(false)} disabled={isDeleting}>
              No
            </button>
          </div>
        ) : (
          <>
            <div className={styles.chatHeaderInfo}>
              <span className={styles.statusDot}></span>
              <h3>Asistente MaternityAI</h3>
            </div>
            <div className={styles.headerActions}>
              <button
                className={styles.headerSymptomBtn}
                onClick={handleToggleSymptomPanel}
                title="Reportar síntomas"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>Reportar síntomas</span>
              </button>
              {messages.length > 0 && clearHistory && (
                <button
                  className={styles.headerClearBtn}
                  onClick={() => setConfirmingDelete(true)}
                  title="Borrar historial"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Listado de mensajes */}
      <div ref={chatsContainerRef} className={styles.chats}>
        {isLoading && messages.length === 0 ? (
          <div className={styles.chatLoader}>
            <div className={styles.spinner}></div>
            <p>Cargando conversación...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className={styles.emptyChat}>
            <div className={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ca436e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3>¡Hola! Soy tu asistente MaternityAI</h3>
            <p>Pregúntame cualquier duda que tengas sobre tu embarazo, nutrición, controles o síntomas.</p>

            <div className={styles.suggestionsContainer}>
              {getQuickSuggestions(activeTopicTag).map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={styles.suggestionBtn}
                  onClick={async () => {
                    if (isSending || isLoading) return;
                    const formattedText = formatOutgoingMessage(suggestion, activeTopicTag);
                    await sendMessage(formattedText);
                  }}
                  disabled={isSending || isLoading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.rol === 'user';
            return (
              <div
                key={msg.id}
                className={isUser ? styles.userBubbleWrapper : styles.aiBubbleWrapper}
              >
                <div className={isUser ? styles.user : styles.Ai}>
                  {isUser ? <p>{msg.contenido}</p> : parseMarkdown(msg.contenido)}
                  <span className={styles.timeLabel}>
                    {new Date(msg.created_at).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator (IA escribiendo...) */}
        {isSending && (
          <div className={styles.aiBubbleWrapper}>
            <div className={`${styles.Ai} ${styles.typingBubble}`}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Panel de reporte de síntomas (Triage) */}
      {showSymptomPanel && (
        <div className={styles.symptomPanel}>
          <label className={styles.symptomLabel}>
            Describe tus síntomas, separados por coma
          </label>
          <textarea
            className={styles.symptomTextarea}
            placeholder="Ej: dolor de cabeza intenso, hinchazón en manos, sangrado"
            value={symptomsText}
            onChange={(e) => setSymptomsText(e.target.value)}
            disabled={triage.isLoading}
            rows={2}
          />
          <div className={styles.symptomActions}>
            <button
              type="button"
              className={styles.symptomCancelBtn}
              onClick={handleToggleSymptomPanel}
              disabled={triage.isLoading}
            >
              Cancelar
            </button>
            <button
              type="button"
              className={styles.symptomSubmitBtn}
              onClick={handleRunTriage}
              disabled={triage.isLoading || !symptomsText.trim()}
            >
              {triage.isLoading ? 'Evaluando...' : 'Evaluar urgencia'}
            </button>
          </div>
        </div>
      )}

      {/* Error del triage */}
      {triage.error && (
        <div className={styles.errorBanner}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span style={{ verticalAlign: 'middle' }}>{triage.error}</span>
        </div>
      )}

      {/* Resultado del triage */}
      {triage.result && (
        <div
          className={`${styles.triageCard} ${
            triage.result.requiere_llamada_emergencia ? styles.triageEmergency : styles.triageNormal
          }`}
        >
          <div className={styles.triageHeader}>
            <span className={styles.triageTitle}>
              {triage.result.requiere_llamada_emergencia
                ? '🚨 Atención médica inmediata recomendada'
                : 'Evaluación de síntomas'}
            </span>
            <button
              className={styles.triageCloseBtn}
              onClick={triage.clearResult}
              aria-label="Cerrar evaluación"
            >
              &times;
            </button>
          </div>
          <p className={styles.triageUrgencyLabel}>
            Nivel de urgencia:{' '}
            <strong>{URGENCY_LABELS[triage.result.nivel_urgencia] || triage.result.nivel_urgencia}</strong>
          </p>
          <p className={styles.triageDescription}>{triage.result.descripcion}</p>
          {triage.result.acciones_recomendadas.length > 0 && (
            <ul className={styles.triageActionsList}>
              {triage.result.acciones_recomendadas.map((accion, idx) => (
                <li key={idx}>{accion}</li>
              ))}
            </ul>
          )}
          {triage.result.requiere_llamada_emergencia && (
            <div className={styles.triageEmergencyBanner}>
              Contacta a tu equipo médico de inmediato o llama a los servicios de emergencia de tu localidad.
            </div>
          )}
        </div>
      )}

      {/* Alerta de error si ocurre alguno */}
      {error && (
        <div className={styles.errorBanner}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span style={{ verticalAlign: 'middle' }}>{error}</span>
        </div>
      )}

      {/* Input de envío */}
      <form onSubmit={handleSend} className={styles.formInput}>
        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            placeholder="Pregunta lo que quieras acerca del embarazo y puerperio"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSending || isLoading}
          />
          <button
            type="submit"
            className={styles.sendBtn}
            disabled={!inputText.trim() || isSending || isLoading}
            aria-label="Enviar"
          >
            {isSending ? (
              <div className={styles.spinnerBtn}></div>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
export default ChatIA;
