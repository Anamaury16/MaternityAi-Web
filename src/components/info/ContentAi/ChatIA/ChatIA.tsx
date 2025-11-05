import { Ai } from './Mensajes/Ai/Ai';
import { User } from './Mensajes/User/User';
import styles from './ChatIA.module.css';

export const ChatIA = () => {
  return (
    <section className={styles.contenedor1}>
      <div className={styles.chats}>
        <div className={styles.user}>
          <User />
        </div>

        <div className={styles.Ai}>
          <Ai />
        </div>
        <div className={styles.user}>
          <User />
        </div>

        <div className={styles.Ai}>
          <Ai />
        </div>
        <div className={styles.user}>
          <User />
        </div>

        <div className={styles.Ai}>
          <Ai />
        </div>
      </div>

      <input
        className={styles.input}
        placeholder="Pregunta lo que quieras acerca del embarazo y puerperio"
      ></input>
    </section>
  );
};
