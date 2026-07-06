import { useState } from 'react';
import { useDailyQuestions } from '../../../../../hooks/clinical/useClinical';
import { CuestionarioModal } from './Cuestionariomodal';
import type { RespuestaItem } from '../../../../../services/clinicalService';
import { SvgClipboard } from '../../../../Icons/IconsSystem';
import styles from './Cuestionario.module.css';

export const Cuestionario = () => {
  const { questions, loading, submit } = useDailyQuestions();
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (respuestas: RespuestaItem[]) => {
    await submit({ respuestas });
  };

  return (
    <>
      <section className={styles.cuestionario}>
        <div className={styles.header}>
          <div className={styles.iconBadge}>
            <SvgClipboard width={18} height={18} stroke="#ca436e" />
          </div>
          <h4>Cuestionario diario</h4>
          <span className={styles.infoIcon} title="Información sobre el cuestionario diario">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A08090" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </span>
        </div>
        <p>
          Queremos estar contigo en cada etapa de tu embarazo y posparto.
          Comparte cómo te sientes y así podremos acompañarte mejor y cuidar de
          tu bienestar.
        </p>
        <button className={styles.boton} onClick={() => setModalOpen(true)}>
          Realizar cuestionario
        </button>
      </section>

      {modalOpen && (
        <CuestionarioModal
          questions={questions}
          loading={loading}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};
