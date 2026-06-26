import { PreguntasFrecuentes } from './CARDS/CardPF/PreguntasFrecuentes';
import { Recomendaciones } from './CARDS/CardR/Recomendaciones';
import styles from './ContentBiblioteca.module.css';
import { Posts } from './posts/Posts';

export const ContentBiblioteca = () => {

  return (
    <div className={styles.container}>
      {/* --- DESKTOP VIEW --- */}
      <div className={styles.desktopView}>
        <div className={styles.left}>
          <Recomendaciones />
          <PreguntasFrecuentes />
        </div>
        <div className={styles.publicaciones}>
          <Posts />
        </div>
      </div>

      {/* --- MOBILE VIEW --- */}
      <div className={styles.mobileView}>
        <div className={styles.mobileHeader}>
          {/* Tuerca eliminada a petición del usuario */}
        </div>
        
        <div className={styles.mobileRecomendacionesContainer}>
          <Recomendaciones />
        </div>
        
        <div className={styles.mobileContent}>
          <Posts />
        </div>

        <div className={styles.mobilePreguntasContainer}>
          <PreguntasFrecuentes />
        </div>
      </div>
    </div>
  );
};
