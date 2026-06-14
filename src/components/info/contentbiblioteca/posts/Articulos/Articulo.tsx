import React from 'react';
import styles from './Articulo.module.css';
import type { ContenidoEducativoResponse } from '../../../../../services/m5Service';

interface ArticuloProps {
  post: ContenidoEducativoResponse;
}

export const Articulo = React.memo(({ post: {titulo, descripcion, url_imagen, url_recurso} }: ArticuloProps) => {
  return (
    <article className={styles.articulo}>
      {url_imagen  && <img src={url_imagen} loading="lazy" decoding="async" />}
      <div className={styles.contenido}>
        <h2 className={styles.title}>{titulo}</h2>
        <p>{descripcion}</p>
        <div className={styles.detalles}>
          {url_recurso && (
            <button className={styles.boton} onClick={() => window.open(url_recurso, '_blank')}>
              Ver más
            </button>
          )}
        </div>
      </div>
    </article>
  );
});
