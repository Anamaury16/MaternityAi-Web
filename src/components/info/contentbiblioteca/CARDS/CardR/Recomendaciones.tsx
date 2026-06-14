import React from 'react';
import styles from './recomendaciones.module.css';
import { useRecommendations } from '../../../../../hooks/clinical/useClinical';

export const Recomendaciones = React.memo(() => {
  const {data, loading} = useRecommendations()
  return (
    <section className={styles.recomendaciones}>
      <h3>RECOMENDACIONES PARA HOY</h3>
      {loading ? <p>Cargando recomendaciones...</p> :(      
      <div className={styles.carousel}>
        {data?.recomendaciones.map((rec, index) => (
          <div key={index} className={styles.articulo}>
            {rec}
          </div>
        ))}
      </div>)}
      {!loading && data?.recomendaciones.length === 0 && <p>No hay recomendaciones disponibles.</p>}
    </section>
  );
});
