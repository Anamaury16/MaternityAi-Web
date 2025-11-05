import styles from './UserInfo.module.css';
export const UserInfo = () => {
  return (
    <section className={styles.containerInfo}>
      <h2>Mi información</h2>
      <div className={styles.foto}>
        <p className={styles.fotoperfil}>Foto de perfil</p>
        <img src="/image/profilepicture.png" />
        <button>Cargar nueva foto</button>
        <button className={styles.color}>Eliminar</button>
      </div>

      <div className={styles.data}>
        <p>Nombre</p>
        <span>Ana Milena</span>
        <p>Apellidos</p>
        <span>Maury Palacios</span>
        <p>Usuario</p>
        <span>Anamaury01</span>
      </div>
    </section>
  );
};
