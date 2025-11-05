import styles from './Articulo.module.css';
export const Articulo = () => {
  return (
    <article className={styles.articulo}>
      <img src="./image/posts/pastilla.png" />
      <div className={styles.contenido}>
        <h2 className={styles.title}>Lorem ipsum dolor sit</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipiscing elit aptent eget
          eros, dui dictumst vestibulum sociosqu conubia habitasse curae metus
          suscipit, tellus vulputate enim di am quam duis ligula ultricies
          sapien. Laoreet habitant facilisis risus bibendum volut
        </p>
        <div className={styles.detalles}>
          <p>08-06-2025</p>
          <button className={styles.boton}>Ver mas</button>
        </div>
      </div>
    </article>
  );
};
