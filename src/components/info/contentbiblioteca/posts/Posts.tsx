import React from 'react';
import { Articulo } from './Articulos/Articulo';
import { Videos } from './Videos/Videos';
import styles from './Posts.module.css';

export const Posts = React.memo(() => {
  return (
    <div className={styles.container}>
      <div className={styles.posts}>
        <Articulo />
        <Videos />
        <Articulo />
      </div>
    </div>
  );
});
