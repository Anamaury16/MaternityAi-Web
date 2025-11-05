import styles from './Notificacion.module.css';
export const Notificacion = () => {
  return (
    <section className={styles.container}>
      <div>
        <p className={styles.nombre_notificacion}>Prevencion</p>
        <h2 className={styles.title}>Encuesta Semanal - 1er Trimestre</h2>
        <p className={styles.desc}>
          Ha empezado nuestro primer trimestre, vamos a disfrutar cada momento
          juntos pero primero que todo debemos realizar un par de preguntas.
        </p>
        <div className={styles.fecha}>
          <p className={styles.nombre}>Ana</p>
          <p>14 Marzo del 2024</p>
        </div>
      </div>

      <img src="./image/notificaciones.png" />
    </section>
  );
};
