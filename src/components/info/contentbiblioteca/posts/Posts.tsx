import React from 'react';
import { Articulo } from './Articulos/Articulo';
import styles from './Posts.module.css';
import { useEducationalContent } from '../../../../hooks/m5/usM5';
import { Videos } from './Videos/Videos';

export const Posts = React.memo(() => {
  const {data, loading, error} = useEducationalContent()
  return (
    <div className={styles.container}>
      <div className={styles.posts}>
        {loading && <p>Cargando contenido educativo...</p>}
        {error && <p className={styles.error}>Error al cargar el contenido educativo.</p>}
        {data && data.map((item) => {
          if (item.tipo_contenido === "video") return <Videos key={item.id} post={item} />;
          return(
          <Articulo key={item.id} post={item} />
        )})}
      </div>
    </div>
  );
});
