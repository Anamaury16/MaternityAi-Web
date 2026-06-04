import React from 'react';
import styles from './recomendaciones.module.css';

export const Recomendaciones = React.memo(() => {
  return (
    <section className={styles.recomendaciones}>
      <h3>RECOMENDACIONES PARA HOY</h3>
      <div className={styles.carousel}>
        <div className={styles.articulo}>
          Reconocer sintomas de parto
          <button>Ver mas</button>
        </div>

        <div className={styles.articulo}>
          Reconocer sintomas de parto<button>Ver mas</button>
        </div>

        <div className={styles.articulo}>
          Reconocer sintomas de parto<button>Ver mas</button>
        </div>

        <div className={styles.articulo}>
          Reconocer sintomas de parto<button>Ver mas</button>
        </div>
      </div>
    </section>
  );
});
