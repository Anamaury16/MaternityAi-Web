import { Link, useNavigate } from 'react-router-dom';
import { DegradedText } from '../../gradedcomponents/degradedtext/DegradedText';
import styles from './HeaderActividad.module.css';

{/* interface para los roles */}
interface HeaderActividadProps {
  rol?: 'paciente' | 'medico' | 'admin';
  tabActivo?: string; 
}


export const HeaderActividad = ({ rol }: HeaderActividadProps) => {
  const navigate = useNavigate();
  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <DegradedText text="MaternityAi" fontSize="23px" />
      </div>

      <nav>        
        {(rol === 'paciente' || !rol) && (
          <>
            <Link to={'/main'} className={styles.main}>Principal</Link>
            <Link to={'/biblioteca'} className={styles.link}>Biblioteca</Link>
            <Link to={'/actividad'} className={styles.actividad}>Actividad</Link>
            <Link to={'/ai'} className={styles.ai}>Chat IA</Link>
          </>
        )}

        {/* link hacia los roles medico */}
        {rol === 'medico' && (
          <>
            <Link to={'/admin/usuarias'} className={styles.link}>Usuarias</Link>
            <Link to={'/admin/oba'} className={styles.link}>OBA</Link>
            <Link to={'/admin/preguntas'} className={styles.link}>Preguntas</Link>
            <Link to={'/admin/citas'} className={styles.link}>Citas</Link>
          </>
        )}

        {/* link hacia los roles admin */}
        {rol === 'admin' && (
          <>
            <Link to={'/admin/oba'} className={styles.link}>OBA</Link>
            <Link to={'/admin/preguntas'} className={styles.link}>Preguntas</Link>
          </>
        )}
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
