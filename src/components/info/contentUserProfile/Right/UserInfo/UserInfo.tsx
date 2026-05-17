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
        <p className={styles.fotoperfil}>Foto de perfil</p>
        <div className={styles.initialAvatar}>{initial}</div>
        <button>Cargar nueva foto</button>
        <button className={styles.color}>Eliminar</button>
      </div>

      <div className={styles.data}>
        <p>Nombre</p>
        <span>{nombre}</span>
        <p>Apellidos</p>
        <span>{apellidos}</span>
        <p>Usuario</p>
        <span>{usuario}</span>
      </div>
    </section>
  );
};
