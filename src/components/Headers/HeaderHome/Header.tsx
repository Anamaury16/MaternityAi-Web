import { Link } from 'react-router-dom';
import { GradedButton } from '../../gradedbutton/GradedButton';
import { DegradedText } from '../../gradedcomponents/degradedtext/DegradedText';
import styles from './header.module.css';

export const Header = () => {
  return (
    <header className={styles.headerStyle}>
      <nav className={styles.container}>
        <Link to={'/'} className={styles.logo}>
          <DegradedText text={'MaternityAi'} fontSize="20px" />
        </Link>
        <Link to={'/'} className={styles.home}>
          Home
        </Link>
        <Link to={'/nosotros'} className={styles.nosotros}>
          Nosotros
        </Link>
        <Link to={'/login'} state={{ isStaff: true }} style={{ textDecoration: 'none' }}>
          <GradedButton textbutton={'Acceso Médico'} height="35px" width="130px" />
        </Link>
      </nav>
    </header>
  );
};
