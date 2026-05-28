import { useState } from 'react';
import type { CatalogoItem } from '../../../services/adminService';
import modalStyles from '../../../pages/adminPages/StaffModal.module.css';
import styles from './CatalogField.module.css';

interface CatalogFieldProps {
  label: string;
  items: CatalogoItem[];
  /** Valor en modo selector (ID como string, undefined = sin selección) */
  selectedId: string | undefined;
  /** Valor en modo texto libre */
  textoLibre: string;
  onSelectId: (id: string | undefined) => void;
  onTextoLibre: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export const CatalogField = ({
  label,
  items,
  selectedId,
  textoLibre,
  onSelectId,
  onTextoLibre,
  disabled,
  required,
}: CatalogFieldProps) => {
  const [modoLibre, setModoLibre] = useState(false);

  const handleToggle = () => {
    setModoLibre((prev) => {
      // Al volver al selector, limpiar el texto libre; al ir a libre, limpiar id
      if (!prev) {
        onSelectId(undefined);
      } else {
        onTextoLibre('');
      }
      return !prev;
    });
  };

  return (
    <div className={modalStyles.field}>
      <label className={modalStyles.label}>{label}</label>

      {!modoLibre ? (
        <select
          className={modalStyles.select}
          value={selectedId ?? ''}
          onChange={(e) =>
            onSelectId(e.target.value ? e.target.value : undefined)
          }
          disabled={disabled}
          required={required}
        >
          <option value="">Selecciona...</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nombre}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={modalStyles.input}
          type="text"
          placeholder="Escribe el valor manualmente"
          value={textoLibre}
          onChange={(e) => onTextoLibre(e.target.value)}
          disabled={disabled}
          required={required}
        />
      )}

      <button
        type="button"
        className={styles.toggleBtn}
        onClick={handleToggle}
        disabled={disabled}
      >
        {modoLibre ? '← Ver lista' : '¿No está en la lista?'}
      </button>
    </div>
  );
};
