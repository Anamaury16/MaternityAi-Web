import { ButtonAi } from '../../buttons/buttonAi/ButtonAi';
import { DegradedText } from '../../gradedcomponents/degradedtext/DegradedText';
import styles from './ContentUs.module.css';
export const ContentUs = () => {
  return (
    <section className={styles.container}>
      <div className={styles.text_information}>
        <div style={{ width: '30%', lineHeight: '4rem' }}>
          <DegradedText text="Quienes somos?" fontSize="70px" />
        </div>
        <p>
          En <DegradedText text="MaternityAi" /> Creemos que cada etapa del
          embarazo y el posparto merece un acompañamiento cálido, confiable y
          humano. Somos un equipo apasionado por la tecnología y la salud
          maternal, comprometido con brindar apoyo emocional, educativo y
          personalizado a mujeres embarazadas y en puerperio.
        </p>
      </div>
      <div className={styles.articles}>
        <article>
          <h3 className={styles.first}>
            <div>
              AI <ButtonAi />
            </div>
            <div>Integrada</div>
          </h3>
        </article>

        <article className={styles.article_medium}>
          <h3>Biblioteca</h3>
          <img src="/image/biblioteca.png" />
        </article>

        <article className={styles.article_end}>
          <div>
            <h3>Control diario</h3>
            <img src="/image/cuestionario.png" />
          </div>
        </article>
      </div>
    </section>
  );
};
