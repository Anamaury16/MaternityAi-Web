import { useState } from 'react';
import { PreguntasFrecuentes } from './CARDS/CardPF/PreguntasFrecuentes';
import { Recomendaciones } from './CARDS/CardR/Recomendaciones';
import styles from './ContentBiblioteca.module.css';
import { Posts } from './posts/Posts';
import { SvgGear } from '../../Icons/IconsSystem';
import { logoutUser } from '../../../services/authService';
import { useNavigate } from 'react-router-dom';

export const ContentBiblioteca = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

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
          <div className={styles.gearContainer}>
            <button 
              className={styles.gearBtn} 
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <SvgGear width={28} height={28} />
            </button>
            
            {menuOpen && (
              <div className={styles.dropdownMenu}>
                <button className={styles.dropdownItem}>
                  Terminos y condiciones
                </button>
                <button 
                  className={`${styles.dropdownItem} ${styles.logoutText}`}
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
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
