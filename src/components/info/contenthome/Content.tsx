import { useNavigate } from 'react-router-dom';
import { DegradedText } from '../../gradedcomponents/degradedtext/DegradedText';
import { SvgArrowRight } from '../../Icons/IconsSystem';
import styles from './Content.module.css';

export const Content = () => {
  const navigate = useNavigate();
  return (
    <section className={styles.container}>
      <div className={styles.left}>
        <div
          style={{
            width: '30%',
          }}
        >
          <DegradedText text="MaternityAi" fontSize="60px" />
        </div>
        <p>
          Impulsada por inteligencia artificial, nuestra asistente virtual
          ofrece orientación basada en evidencia, recordatorios de salud,
          consejos de autocuidado y recursos confiables para el bienestar físico
          y mental de la madre y su bebé.
        </p>
        <button onClick={() => navigate('/login')}>
          Comenzar <SvgArrowRight />
        </button>
      </div>
      <img className={styles.foto} src="/image/home.jpg" alt="Home" />
    </section>
  );
};
