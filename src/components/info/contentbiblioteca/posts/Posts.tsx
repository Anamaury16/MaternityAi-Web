import React from 'react';
import { Articulo } from './Articulos/Articulo';
import { Videos } from './Videos/Videos';
import styles from './Posts.module.css';
import type { ContenidoEducativoResponse } from '../../../../services/m5Service';

interface Props {
  data: ContenidoEducativoResponse[];
  loading: boolean;
  error: string | null;
}

const CardSkeleton = () => (
  <div className={styles.skeleton}>
    <div className={styles.skeletonBadge} />
    <div className={styles.skeletonTitle} />
    <div className={styles.skeletonLine} />
    <div className={styles.skeletonLine} style={{ width: '60%' }} />
  </div>
);

export const Posts = React.memo(({ data, loading, error }: Props) => {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  if (error) {
    return <p className={styles.error}>Error al cargar el contenido educativo.</p>;
  }

  if (data.length === 0) {
    return <p className={styles.empty}>No se encontraron resultados.</p>;
  }

  return (
    <div className={styles.grid}>
      {data.map(item =>
        item.tipo_contenido === 'video'
          ? <Videos key={item.id} post={item} />
          : <Articulo key={item.id} post={item} />
      )}
    </div>
  );
});
