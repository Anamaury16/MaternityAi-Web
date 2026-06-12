import { useState } from 'react';
import { useSymptoms } from '../../../../../hooks/clinical/useClinical';
import { ReporteModal } from './ReporteModal';
import styles from './Reporte.module.css';

interface Props {
  text: string;
}

export const Reporte = ({ text }: Props) => {
  const { report, loading, error } = useSymptoms();
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (
    descripcion: string,
    severidad: 'leve' | 'moderado' | 'severo' | null,
  ) => {
    await report({ descripcion, severidad: severidad ?? undefined });
  };

  return (
    <>
      <div
        className={styles.reporte}
        onClick={() => setModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setModalOpen(true); }}
        aria-label={text}
      >
        {text}
      </div>

      {modalOpen && (
        <ReporteModal
          loading={loading}
          error={error}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};