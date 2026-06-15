import { useEffect, useRef, useState } from 'react';
import styles from './ChatIA.module.css';
import { type ChatMessage } from '../../../../services/iaService';

interface ChatIAProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  clearHistory?: () => Promise<boolean>;
}

export const ChatIA = ({
  messages,
  isLoading,
  isSending,
  error,
  sendMessage,
  clearHistory,
}: ChatIAProps) => {
  const [inputText, setInputText] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const chatsContainerRef = useRef<HTMLDivElement>(null);

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
    await sendMessage(text);
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
                  <p>{msg.contenido}</p>
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
