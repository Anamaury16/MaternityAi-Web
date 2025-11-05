import { Link } from 'react-router-dom';
import { GradedButton } from '../../gradedbutton/GradedButton';
import { DegradedText } from '../../gradedcomponents/degradedtext/DegradedText';
import styles from './header.module.css';

export const Header = () => {
  return (
    <header className={styles.headerStyle}>
      <nav className={styles.container}>
        <DegradedText text={'MaternityAi'} fontSize="20px" />
        <Link to={'/'} className={styles.home}>
          Home
        </Link>
        <Link to={'/nosotros'} className={styles.nosotros}>
          Nosotros
        </Link>
        <GradedButton textbutton={'registrar'} height="35px" width="110px" />
      </nav>
    </header>
  );
};
