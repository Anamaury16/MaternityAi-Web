import { useState } from 'react';
import styles from './Historial.module.css';
import { SvgSparkle } from '../../../Icons/IconsSystem';

interface HistorialProps {
  clearHistory: () => Promise<boolean>;
  hasMessages: boolean;
}

const TOPICS = [
  'Consulta General IA',
  'Guía de Alimentación',
  'Signos de Alarma y Alertas',
  'Preparación para el Parto',
];

export const Historial = ({ clearHistory, hasMessages }: HistorialProps) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTopic, setActiveTopic] = useState(0);

  const handleDelete = async () => {
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
    <div className={styles.historial}>
      <div className={styles.headerRow}>
        <h1>Chats</h1>
        <div className={styles.sparkleBadge}>
          <SvgSparkle width={14} height={14} fill="white" />
        </div>
      </div>

      <div className={styles.contenedorChats}>
        {TOPICS.map((topic, index) => (
          <div
            key={index}
            className={`${styles.chatItem} ${index === activeTopic ? styles.activeItem : ''}`}
            onClick={() => setActiveTopic(index)}
          >
            <p className={styles.chatName}>{topic}</p>
            {index === 0 && (
              <p className={styles.chatStatus}>
                <span className={styles.statusDot}></span> En línea
              </p>
            )}
          </div>
        ))}
      </div>

      {hasMessages && (
        <div className={styles.deleteWrapper}>
          {!confirmingDelete ? (
            <button
              className={styles.deleteBtn}
              onClick={() => setConfirmingDelete(true)}
              title="Borrar todo el historial de chat de forma permanente"
            >
              🗑️ Borrar Historial
            </button>
          ) : (
            <div className={styles.confirmBox}>
              <p>¿Segura de borrar todo el historial?</p>
              <div className={styles.confirmActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setConfirmingDelete(false)}
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button
                  className={styles.confirmBtn}
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Borrando...' : 'Sí, eliminar'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Historial;
