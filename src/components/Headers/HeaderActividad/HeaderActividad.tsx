import { Link, useNavigate } from 'react-router-dom';
import { DegradedText } from '../../gradedcomponents/degradedtext/DegradedText';
import styles from './HeaderActividad.module.css';
export const HeaderActividad = () => {
  const navigate = useNavigate();
  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <DegradedText text="MaternityAi" fontSize="23px" />
      </div>
      <nav>
        <Link to={'/main'} className={styles.main}>
          Principal
        </Link>
        <Link to={'/biblioteca'} className={styles.link}>
          Biblioteca
        </Link>
        <Link to={'/actividad'} className={styles.actividad}>
          Actividad
        </Link>
        <Link to={'/ai'} className={styles.ai}>
          Chat IA
        </Link>
      </nav>

      <div onClick={() => navigate('/userprofile')} className={styles.perfil}>
        <div>
          <img src="/image/profilepicture.png" className={styles.foto} />
        </div>

        <div>
          <p className={styles.name}>Ana Maury</p>
          <p className={styles.desc}>Paciente</p>
        </div>
      </div>
    </header>
  );
};
