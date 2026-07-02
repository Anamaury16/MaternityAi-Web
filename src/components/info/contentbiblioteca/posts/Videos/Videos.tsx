import React from 'react';
import styles from './Videos.module.css';
import type { ContenidoEducativoResponse } from '../../../../../services/m5Service';

interface VideosProps {
  post: ContenidoEducativoResponse;
}

export const Videos = React.memo(({ post }: VideosProps) => {
  const { titulo, descripcion, url_recurso, duracion_minutos } = post;

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.badge}>▶ Video</span>
        {duracion_minutos && (
          <span className={styles.meta}>{duracion_minutos} min</span>
        )}
      </div>

      {url_recurso && (
        <div className={styles.videoThumb}>
          <span className={styles.playIcon}>▶</span>
        </div>
      )}

      <h3 className={styles.title}>{titulo}</h3>

      {descripcion && (
        <p className={styles.desc}>{descripcion}</p>
      )}

      <div className={styles.footer}>
        {url_recurso ? (
          <button
            className={styles.btnVer}
            onClick={() => window.open(url_recurso, '_blank')}
          >
            Ver video →
          </button>
        ) : (
          <span className={styles.noLink}>Sin enlace disponible</span>
        )}
      </div>
    </article>
  );
});
