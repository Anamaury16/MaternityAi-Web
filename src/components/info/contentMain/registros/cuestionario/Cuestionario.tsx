import { useState } from 'react';
import { useDailyQuestions } from '../../../../../hooks/clinical/useClinical';
import { CuestionarioModal } from './Cuestionariomodal ';
import type { RespuestaItem } from '../../../../../services/clinicalService';
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
        <h4>Cuestionario diario</h4>
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
