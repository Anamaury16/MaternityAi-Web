import { useState, useEffect } from 'react';
import { getChecklistForGestante, type ChecklistItem } from '../../../../services/m0Service';
import styles from './ProgressChecklist.module.css';

interface Props {
  moduloId: number;
  moduloCodigo: string;
  style?: React.CSSProperties;
}

export const ProgressChecklist = ({ moduloId, moduloCodigo, style }: Props) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getChecklistForGestante(moduloId, moduloCodigo);
        // Ordenar: primero activos (completos), luego pendientes, luego por orden
        const sorted = [...data].sort((a, b) => {
          if (a.activo !== b.activo) return a.activo ? -1 : 1;
          return (a.orden ?? 99) - (b.orden ?? 99);
        });
        setItems(sorted);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [moduloId, moduloCodigo]);

  const completados = items.filter(i => i.activo).length;
  const total = items.length;
  const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;

  return (
    <div className={styles.card} style={style}>
      {/* Encabezado */}
      <div className={styles.header}>
        <h3 className={styles.title}>Mi progreso</h3>
        <span className={styles.badge}>{moduloCodigo}</span>
      </div>

      {/* Barra de progreso */}
      {!loading && total > 0 && (
        <div className={styles.progressWrapper}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
          <div className={styles.progressLabel}>
            <span>{completados} de {total} completados</span>
            <span>{porcentaje}%</span>
          </div>
        </div>
      )}

      {/* Lista de ítems */}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          Cargando checklist...
        </div>
      ) : items.length === 0 ? (
        <p className={styles.empty}>No hay ítems configurados para este módulo.</p>
      ) : (
        <div className={styles.list}>
          {items.map(item => (
            <div
              key={item.id}
              className={`${styles.item} ${item.activo ? styles.itemDone : ''}`}
            >
              <div className={`${styles.icon} ${item.activo ? styles.iconDone : styles.iconPending}`}>
                {item.activo ? '✓' : '○'}
              </div>
              <div>
                <p className={`${styles.itemText} ${item.activo ? styles.itemTextDone : styles.itemTextPending}`}>
                  {item.texto}
                </p>
                {item.semana_eg && (
                  <span className={styles.semanaTag}>Semana {item.semana_eg}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
