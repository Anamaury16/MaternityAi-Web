import styles from './Left.module.css';
export const Left = () => {
  return (
    <aside className={styles.container}>
      <h2>Configuraciones</h2>
      <p>Mi perfil</p>
      <p>Politicas y privacidad</p>
      <p>Cerrar sesion</p>
    </aside>
  );
};
