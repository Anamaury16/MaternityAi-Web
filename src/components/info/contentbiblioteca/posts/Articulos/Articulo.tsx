import React from 'react';
import styles from './Articulo.module.css';
import type { ContenidoEducativoResponse } from '../../../../../services/m5Service';

interface ArticuloProps {
  post: ContenidoEducativoResponse;
}

export const Articulo = React.memo(({ post }: ArticuloProps) => {
  const { titulo, descripcion, url_recurso, duracion_minutos, url_imagen } = post;

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.badge}>📄 Artículo</span>
        {duracion_minutos && (
          <span className={styles.meta}>{duracion_minutos} min lectura</span>
        )}
      </div>

      {url_imagen && (
        <img className={styles.thumbnail} src={url_imagen} alt={titulo} loading="lazy" decoding="async" />
      )}

      <h3 className={styles.title}>{titulo}</h3>

      {descripcion && (
        <p className={styles.desc}>{descripcion}</p>
      )}

      <div className={styles.footer}>
        {url_recurso ? (
          <button
            className={styles.btnLeer}
            onClick={() => window.open(url_recurso!, '_blank')}
          >
            Leer artículo <span>→</span>
          </button>
        ) : (
          <span className={styles.noLink}>Sin enlace disponible</span>
        )}
      </div>
    </article>
  );
});
