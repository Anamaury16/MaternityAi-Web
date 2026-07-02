import React, { useState } from 'react';
import { useCitas } from '../../../../hooks/m6/useM6';
import type { CitaMedicaResponse, CitaMedicaCreate } from '../../../../services/m6Service';
import styles from './CitasPanel.module.css';

const formatFecha = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-CO', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const formatHora = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  });

const estadoConfig: Record<string, { label: string; className: string }> = {
  programada: { label: 'Programada', className: styles.estadoProgramada },
  confirmada: { label: 'Confirmada', className: styles.estadoConfirmada },
  cancelada:  { label: 'Cancelada',  className: styles.estadoCancelada  },
};

const TIPO_EMOJI: Record<string, string> = {
  'control prenatal': '🩺',
  'ecografía':        '🔬',
  'laboratorio':      '🧪',
  'vacuna':           '💉',
};

const getTipoEmoji = (tipo: string | null) => {
  const t = (tipo ?? '').toLowerCase();
  for (const [key, emoji] of Object.entries(TIPO_EMOJI)) {
    if (t.includes(key)) return emoji;
  }
  return '📋';
};

const CitaCard = React.memo(({ cita }: { cita: CitaMedicaResponse }) => {
  const cfg = estadoConfig[cita.estado] ?? { label: cita.estado, className: '' };
  return (
    <div className={styles.card}>
      <div className={styles.cardAvatar}>
        {getTipoEmoji(cita.tipo_cita)}
      </div>

      <div className={styles.cardLeft}>
        <p className={styles.tipo}>{cita.tipo_cita ?? 'Cita médica'}</p>
        <p className={styles.citaMeta}>{formatFecha(cita.fecha_hora)} · {formatHora(cita.fecha_hora)}</p>
      </div>

      <div className={`${styles.estadoIndicador} ${styles[`estado${cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}`] ?? ''}`}>
        <div className={styles.estadoDot} />
        <span className={styles.estadoLabel}>{cfg.label}</span>
      </div>
    </div>
  );
});

const CitaCardSkeleton = () => (
  <div className={styles.card} style={{ opacity: 0.5 }}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ height: 22, width: '35%', borderRadius: 20, background: '#ffe8ee' }} />
      <div style={{ height: 18, width: '70%', borderRadius: 6, background: '#f5e0e8' }} />
      <div style={{ height: 16, width: '55%', borderRadius: 6, background: '#f5e0e8' }} />
      <div style={{ height: 16, width: '40%', borderRadius: 6, background: '#f5e0e8' }} />
    </div>
    <div style={{ width: 56, height: 56, borderRadius: 8, background: '#f5e0e8' }} />
  </div>
);

// ---- Modal para solicitar nueva cita ----
const NuevaCitaModal = ({
  onClose,
  onCreate,
  saving,
}: {
  onClose: () => void;
  onCreate: (payload: CitaMedicaCreate) => Promise<void>;
  saving: boolean;
}) => {
  const [tipoCita, setTipoCita] = useState('');
  const [fechaHora, setFechaHora] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaHora) return;
    await onCreate({ tipo_cita: tipoCita || null, fecha_hora: new Date(fechaHora).toISOString() });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Solicitar nueva cita</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Tipo de cita
            <input
              className={styles.input}
              type="text"
              placeholder="Ej: Control prenatal"
              value={tipoCita}
              onChange={e => setTipoCita(e.target.value)}
            />
          </label>
          <label className={styles.label}>
            Fecha y hora <span className={styles.required}>*</span>
            <input
              className={styles.input}
              type="datetime-local"
              required
              value={fechaHora}
              onChange={e => setFechaHora(e.target.value)}
            />
          </label>
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnCancel} onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnConfirm} disabled={saving || !fechaHora}>
              {saving ? 'Guardando…' : 'Solicitar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface Props {
  horizontal?: boolean;
}

export const CitasPanel = ({ horizontal = false }: Props) => {
  const { data, loading, error, create } = useCitas();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const upcoming = data
    .filter(c => c.estado !== 'cancelada')
    .sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime());

  const handleCreate = async (payload: CitaMedicaCreate) => {
    setSaving(true);
    try { await create(payload); } finally { setSaving(false); }
  };

  return (
    <div className={styles.panelRoot}>
      <div className={styles.panelHeader}>
        <h1 className={styles.panelTitle}>Mis Citas</h1>
        <button className={styles.btnSolicitar} onClick={() => setShowModal(true)}>
          + Solicitar cita
        </button>
      </div>

      <div className={horizontal ? styles.wrapperHorizontal : styles.wrapper}>
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => <CitaCardSkeleton key={i} />)
        ) : error ? (
          <p className={styles.empty}>No se pudieron cargar las citas.</p>
        ) : upcoming.length === 0 ? (
          <p className={styles.empty}>No tienes citas programadas.</p>
        ) : (
          upcoming.map(c => <CitaCard key={c.id} cita={c} />)
        )}
      </div>

      {showModal && (
        <NuevaCitaModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
          saving={saving}
        />
      )}
    </div>
  );
};
