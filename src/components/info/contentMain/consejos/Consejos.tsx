import { useChecklist } from '../../../../hooks/m5/usM5';
import styles from './Consejos.module.css';

interface Props {
  className?: string;
}

export const Consejos = ({ className }: Props) => {
  const { data, loading, updateItem } = useChecklist();

  const completados = data?.items.filter(i => i.completado).length ?? 0;
  const total       = data?.items.length ?? 0;
  const porcentaje  = total > 0 ? Math.round((completados / total) * 100) : 0;

  const handleToggle = (itemId: number, currentState: boolean) => {
    updateItem(itemId, { completado: !currentState });
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
    });
  };

  return (
    <section className={`${styles.container} ${className ?? ''}`}>

      {/* Header */}
      <div className={styles.header}>
        <h3>Preparación para el parto</h3>
        {!loading && total > 0 && (
          <div className={styles.progressPill}>
            <span>{completados}/{total}</span>
          </div>
        )}
      </div>

      {/* Barra de progreso */}
      {!loading && total > 0 && (
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${porcentaje}%` }} />
        </div>
      )}

      {/* Lista de items */}
      {loading ? (
        <div className={styles.loading}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} className={styles.skeleton} />
          ))}
        </div>
      ) : total === 0 ? (
        <div className={styles.empty}>
          <span>🌸</span>
          <p>No hay items en el checklist por ahora.</p>
        </div>
      ) : (
        data?.items.map(item => (
          <article
            key={item.id}
            className={`${styles.item} ${item.completado ? styles.completed : ''}`}
            onClick={() => handleToggle(item.id, item.completado)}
            role="checkbox"
            aria-checked={item.completado}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleToggle(item.id, item.completado);
            }}
          >
            {/* Check circle */}
            <div className={styles.checkCircle}>
              <span className={styles.checkIcon}>✓</span>
            </div>

            {/* Texto */}
            <div className={styles.itemContent}>
              <h4>{item.texto}</h4>
              {item.completado && item.fecha_completado && (
                <p>Completado el {formatDate(item.fecha_completado)}</p>
              )}
            </div>

            {/* Fecha de completado como badge */}
            {item.completado && item.fecha_completado && (
              <span className={styles.dateBadge}>
                {formatDate(item.fecha_completado)}
              </span>
            )}
          </article>
        ))
      )}
    </section>
  );
};