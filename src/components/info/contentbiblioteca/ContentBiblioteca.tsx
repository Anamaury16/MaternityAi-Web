import { PreguntasFrecuentes } from './CARDS/CardPF/PreguntasFrecuentes';
import { Recomendaciones } from './CARDS/CardR/Recomendaciones';
import styles from './ContentBiblioteca.module.css';
import { Posts } from './posts/Posts';

export const ContentBiblioteca = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Recomendaciones />
        <PreguntasFrecuentes />
      </div>
      <div className={styles.publicaciones}>
        <Posts />
      </div>
    </div>
  );
};
