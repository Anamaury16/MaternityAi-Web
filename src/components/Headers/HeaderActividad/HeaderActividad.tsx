import { Link } from 'react-router-dom';
import { DegradedText } from '../../gradedcomponents/degradedtext/DegradedText';
import styles from './HeaderActividad.module.css';

export const HeaderActividad = () => {
  return (
    <>
      <header className={styles.container}>
        <div className={styles.logo}>
          <DegradedText text="MaternityAi" fontSize="23px" />
        </div>

        <nav>
          <Link to="/main" className={styles.main}>
            Principal
          </Link>
          <Link to="/biblioteca" className={styles.link}>
            Biblioteca
          </Link>
          <Link to="/actividad" className={styles.actividad}>
            Actividad
          </Link>
          <Link to="/ai" className={styles.ai}>
            Chat IA
          </Link>
        </nav>

        <div className={styles.perfil}>
          <div>
            <p className={styles.name}>345356</p>
            <p className={styles.desc}>Paciente</p>
          </div>
        </div>
      </header>

      <div className={styles.headerSpacer} />
    </>
  );
};
