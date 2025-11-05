import { ChatIA } from './ChatIA/ChatIA';
import styles from './ContentAi.module.css';
import { Historial } from './Historial/Historial';
export const ContentAi = () => {
  return (
    <section className={styles.container}>
      <div className={styles.historial}>
        <Historial />
      </div>
      <div className={styles.chat}>
        <ChatIA />
      </div>
    </section>
  );
};
