import { useState } from 'react';
import { ChatIA } from './ChatIA/ChatIA';
import styles from './ContentAi.module.css';
import { Historial } from './Historial/Historial';
import { SvgChatConversation } from '../../Icons/IconsSystem';

export const ContentAi = () => {
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const abrirHistorial = () => setMostrarHistorial(true);
  const cerrarHistorial = () => setMostrarHistorial(false);

  return (
    <>
      <section className={styles.container}>
        <div className={styles.historial}>
          <Historial />
        </div>

        <div className={styles.chat}>
          <ChatIA />
        </div>

        <button
          type="button"
          className={styles.botonHistorialMobile}
          onClick={abrirHistorial}
          aria-label="Abrir historial"
        >
          <SvgChatConversation width={24} height={24} />
        </button>
      </section>

      {mostrarHistorial && (
        <div className={styles.overlay} onClick={cerrarHistorial}>
          <div
            className={styles.modalHistorial}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <button
                type="button"
                className={styles.botonCerrar}
                onClick={cerrarHistorial}
                aria-label="Cerrar historial"
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <Historial />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
