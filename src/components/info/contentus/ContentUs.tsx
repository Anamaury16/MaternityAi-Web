import { ButtonAi } from '../../buttons/buttonAi/ButtonAi';
import { DegradedText } from '../../gradedcomponents/degradedtext/DegradedText';
import styles from './ContentUs.module.css';

export const ContentUs = () => {
  return (
    <section className={styles.container}>
      <div className={styles.text_information}>
        <div className={styles.titleWrapper}>
          <DegradedText text="Quienes somos?" fontSize="clamp(38px, 6vw, 70px)" />
        </div>
        <p>
          En <span className={styles.inlineBrand}><DegradedText text="MaternityAi" fontSize="clamp(20px, 3vw, 26px)" /></span> Creemos que cada etapa del
          embarazo y el posparto merece un acompañamiento cálido, confiable y
          humano. Somos un equipo apasionado por la tecnología y la salud
          maternal, comprometido con brindar apoyo emocional, educativo y
          personalizado a mujeres embarazadas y en puerperio.
        </p>
      </div>

      <div className={styles.aiBadge}>
        <h3 className={styles.first}>
          <div className={styles.firstLine}>
            AI <ButtonAi />
          </div>
          <div>Integrada</div>
        </h3>
      </div>

      <div className={styles.bibliotecaCard}>
        <h3>Biblioteca</h3>
        <img src="/image/biblioteca.png" alt="Biblioteca" />
      </div>

      <div className={styles.controlCard}>
        <div className={styles.controlWrapper}>
          <h3>Control diario</h3>
          <img src="/image/cuestionario.png" alt="Control diario" />
        </div>
      </div>
    </section>
  );
};
