import { Mensaje } from '../Mensaje/Mensaje';
import { Notificacion } from '../Notificacion/Notificacion';
import { Notificaciones } from '../notificaciones/Notificaciones';
import styles from './ContentAct.module.css';
export const ContentAct = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Mensaje />
        <div className={styles.notificaciones}>
          <Notificacion />
          <Notificacion />
          <Notificacion />
          <Notificacion />
          <Notificacion />
          <Notificacion />
        </div>
      </div>
      <div className={styles.right}>
        <h1 className={styles.title_notificaciones}>Notificaciones</h1>
        <div className={styles.sms}>
          <Notificaciones />
          <Notificaciones />

          <Notificaciones />
          <Notificaciones />
          <Notificaciones />
          <Notificaciones />

          <Notificaciones />
          <Notificaciones />
          <Notificaciones />
          <Notificaciones />
          <Notificaciones />
          <Notificaciones />
          <Notificaciones />
        </div>
      </div>
    </div>
  );
};
