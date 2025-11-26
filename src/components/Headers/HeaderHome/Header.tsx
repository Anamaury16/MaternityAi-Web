import { Link } from 'react-router-dom';
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
      </nav>
    </header>
  );
};
