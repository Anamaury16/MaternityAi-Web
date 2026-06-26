import { useState } from 'react';
import { HeaderActividad } from '../../Headers/HeaderActividad/HeaderActividad';
import styles from './ContentUserProfile.module.css';
import { Left } from './left/Left';
import { UserInfo } from './Right/UserInfo/UserInfo';
import { ClinicalProfile } from '../../profile/ClinicalProfile';
import { ObstetricFormula } from '../../profile/ObstetricFormula';
import { PathologicalHistory } from '../../profile/PathologicalHistory';
import { GestationalAge } from '../../profile/GestationalAge';
import { SecurityQuestionUpdate } from '../../profile/SecurityQuestionUpdate';
import { DeleteAccount } from '../../profile/DeleteAccount';
import { Terms } from './Right/Terms/Terms';
import { logoutUser } from '../../../services/authService';
import { useNavigate } from 'react-router-dom';

export const ContentUserProfile = () => {
  const [activeTab, setActiveTab] = useState<'perfil' | 'seguridad' | 'privacidad' | 'eliminar_cuenta'>('perfil');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const storedUser = localStorage.getItem('user_name') || '200412';
  let userId = storedUser;
  if (storedUser.startsWith('Gestante')) {
    userId = storedUser.replace('Gestante ', '');
  }

  return (
    <div className={styles.mainWrapper}>
      <HeaderActividad />

      {/* --- DESKTOP VIEW --- */}
      <div className={styles.desktopView}>
        <section className={styles.container}>
          <div className={styles.sidebar}>
            <Left activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className={styles.contentArea}>
            {activeTab === 'perfil' ? (
              <>
                <UserInfo />
                <div className={styles.medicalInfo}>
                  <ObstetricFormula />
                  <ClinicalProfile />
                  <PathologicalHistory />
                  <GestationalAge />
                </div>
              </>
            ) : activeTab === 'seguridad' ? (
              <SecurityQuestionUpdate />
            ) : activeTab === 'eliminar_cuenta' ? (
              <DeleteAccount />
            ) : (
              <Terms />
            )}
          </div>
        </section>
      </div>

      {/* --- MOBILE VIEW --- */}
      <div className={styles.mobileView}>
        <div className={styles.mobileHeader}>
          <div className={styles.greeting}>
            <p>Buenas tardes,</p>
            <h2>{userId} 👋</h2>
          </div>
        </div>

        <div className={styles.fetusImageContainer}>
          <img src="./image/etapas/primertrimestre.png" alt="Feto" className={styles.fetusImage} loading="lazy" decoding="async" />
        </div>

        <div className={styles.bottomSection}>
          <h3 className={styles.sectionTitle}>Datos del bebé</h3>
          <div className={styles.pinkContainer}>
            <div className={styles.babyCard}>
              <span>TAMAÑO</span>
              <strong>92 <small>CM</small></strong>
            </div>
            <div className={styles.babyCard}>
              <span>GRAMOS</span>
              <strong>1.200</strong>
            </div>
          </div>

          <h3 className={styles.sectionTitle}>Mis datos</h3>
          <div className={styles.pinkContainer}>
            <div className={styles.emptyCard}></div>
            <div className={styles.emptyCard}></div>
            <div className={styles.emptyCard}></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
            <ObstetricFormula />
            <ClinicalProfile />
            <PathologicalHistory />
            <GestationalAge />
            <SecurityQuestionUpdate />
            <DeleteAccount />
            
            <button 
              onClick={() => setActiveTab(activeTab === 'privacidad' ? 'perfil' : 'privacidad')}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: '#fff',
                color: '#333',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                textAlign: 'left'
              }}
            >
              Términos y condiciones
            </button>

            {activeTab === 'privacidad' && (
              <div style={{ background: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Terms />
              </div>
            )}

            <button 
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: '#fff',
                color: '#CA436E',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                textAlign: 'left',
                marginTop: '10px'
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
