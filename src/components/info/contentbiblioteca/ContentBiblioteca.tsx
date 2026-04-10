import { useState } from 'react';
import { PreguntasFrecuentes } from './CARDS/CardPF/PreguntasFrecuentes';
import { Recomendaciones } from './CARDS/CardR/Recomendaciones';
import styles from './ContentBiblioteca.module.css';
import { Posts } from './posts/Posts';
import { SvgQuestion } from '../../Icons/IconsSystem';

export const ContentBiblioteca = () => {
  const [mostrarPanelMobile, setMostrarPanelMobile] = useState(false);

  const abrirPanel = () => setMostrarPanelMobile(true);
  const cerrarPanel = () => setMostrarPanelMobile(false);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.left}>
          <Recomendaciones />
          <PreguntasFrecuentes />
        </div>

        <div className={styles.publicaciones}>
          <Posts />
        </div>

        <button
          type="button"
          className={styles.botonHistorialMobile}
          onClick={abrirPanel}
          aria-label="Abrir recomendaciones y preguntas frecuentes"
        >
          <SvgQuestion width={24} height={24} />
        </button>
      </div>

      {mostrarPanelMobile && (
        <div className={styles.overlay} onClick={cerrarPanel}>
          <div
            className={styles.modalHistorial}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <button
                type="button"
                className={styles.botonCerrar}
                onClick={cerrarPanel}
                aria-label="Cerrar panel"
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <Recomendaciones />
              <PreguntasFrecuentes />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
