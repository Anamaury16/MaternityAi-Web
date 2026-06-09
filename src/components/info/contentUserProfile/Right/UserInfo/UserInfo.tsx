import styles from './UserInfo.module.css';
export const UserInfo = () => {
  const storedUser = localStorage.getItem('user_name') || '';
  
  let nombre = 'Usuario';
  let apellidos = 'No especificado';
  let usuario = storedUser || 'Usuario';
  let initial = 'U';

  if (storedUser.startsWith('Gestante')) {
    nombre = 'Gestante';
    apellidos = 'MaternityAi';
    usuario = storedUser.replace('Gestante ', '');
    initial = 'G';
  } else if (storedUser.includes('@')) {
    nombre = 'Personal Médico';
    apellidos = '';
    usuario = storedUser;
    initial = storedUser.charAt(0).toUpperCase();
  } else if (storedUser) {
    nombre = storedUser;
    initial = storedUser.charAt(0).toUpperCase();
  }

  return (
    <section className={styles.containerInfo}>
      <h2>Mi información</h2>
      <div className={styles.foto}>
        <span className={styles.fotoperfil}>Foto de perfil</span>
        <div className={styles.initialAvatar}>{initial}</div>
        <div className={styles.photoButtons}>
          <button className={styles.uploadBtn}>Cargar nueva foto</button>
          <button className={styles.deleteBtn}>Eliminar</button>
        </div>
      </div>

      <div className={styles.data}>
        <div className={styles.infoField}>
          <label>Nombre</label>
          <span>{nombre}</span>
        </div>
        <div className={styles.infoField}>
          <label>Apellidos</label>
          <span>{apellidos}</span>
        </div>
        <div className={styles.infoField}>
          <label>Usuario</label>
          <span>{usuario}</span>
        </div>
      </div>
    </section>
  );
};
