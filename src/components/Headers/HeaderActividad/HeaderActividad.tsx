import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DegradedText } from '../../gradedcomponents/degradedtext/DegradedText';
import { logoutUser } from '../../../services/authService';
import styles from './HeaderActividad.module.css';
import { MobileBottomNav } from '../MobileBottomNav';
import { AlertasPanel } from '../../alertas/AlertasPanel';

interface HeaderActividadProps {
  rol?: 'paciente' | 'medico' | 'admin' | 'hospital';
  tabActivo?: string; 
}

export const HeaderActividad = ({ rol }: HeaderActividadProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const rawRole = localStorage.getItem('role') || rol;
  const activeRole: 'paciente' | 'medico' | 'admin' | 'hospital' = 
    rawRole === 'admin' ? 'admin' :
    rawRole === 'hospital' ? 'hospital' :
    (rawRole === 'clinico' || rawRole === 'medico') ? 'medico' : 'paciente';

  const [alertsOpen, setAlertsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const getTabClass = (path: string) => {
    return currentPath.includes(path) ? `${styles.tab} ${styles.activeTab}` : styles.tab;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAlertsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
    <header className={`${styles.container} ${currentPath === '/main' || currentPath === '/biblioteca' || currentPath === '/userprofile' ? styles.hideOnMobileMain : ''}`}>
      <div className={styles.logo}>
        <DegradedText text="MaternityAi" fontSize="23px" />
      </div>

      <nav>        
        {activeRole === 'paciente' && (
          <>
            <Link to={'/main'} className={getTabClass('/main')}>Principal</Link>
            <Link to={'/biblioteca'} className={getTabClass('/biblioteca')}>Biblioteca</Link>
            <Link to={'/actividad'} className={getTabClass('/actividad')}>Actividad</Link>
            <Link to={'/ai'} className={getTabClass('/ai')}>Chat IA</Link>
          </>
        )}

        {/* Links específicos de Admin */}
        {activeRole === 'admin' && (
          <>
            <Link to={'/admin/usuarias'} className={styles.link}>Usuarias</Link>
            <Link to={'/admin/oba'} className={styles.link}>OBA</Link>
            <Link to={'/admin/preguntas'} className={styles.link}>Preguntas</Link>
            <Link to={'/admin/citas'} className={styles.link}>Citas</Link>
            <Link to={'/admin/cargas'} className={styles.link}>Cargas</Link>
            <Link to={'/admin/checklist'} className={styles.link}>Checklist</Link>
            <Link to={'/admin/ia'} className={styles.link}>IA</Link>
          </>
        )}

        {/* Links específicos de Médico / Clínico */}
        {activeRole === 'medico' && (
          <>
            <Link to={'/clinico/usuarias'} className={styles.link}>Usuarias</Link>
            <Link to={'/clinico/oba'} className={styles.link}>OBA</Link>
            <Link to={'/clinico/preguntas'} className={styles.link}>Preguntas</Link>
            <Link to={'/clinico/citas'} className={styles.link}>Citas</Link>
            <Link to={'/clinico/cargas'} className={styles.link}>Cargas</Link>
            <Link to={'/clinico/checklist'} className={styles.link}>Checklist</Link>
            <Link to={'/clinico/ia'} className={styles.link}>IA</Link>
          </>
        )}

        {activeRole === 'hospital' && (
          <>
            <Link to={'/hospital/dashboard'} className={getTabClass('/hospital/dashboard')}>Monitoreo de Alertas</Link>
          </>
        )}
      </nav>

      <div className={styles.perfilSection} ref={dropdownRef}>
        {activeRole === 'paciente' && (
          <button 
            onClick={() => setAlertsOpen(!alertsOpen)}
            className={`${styles.bellBtn} ${alertsOpen ? styles.bellActive : ''}`}
            aria-label="Alertas y Notificaciones"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
        )}

        <div onClick={() => navigate('/userprofile')} className={styles.perfil}>
          <div>
            <p className={styles.name}>{localStorage.getItem('user_name') || 'Usuario'}</p>
            <p className={styles.desc}>
              {activeRole === 'medico' ? 'Personal Médico' : 
               activeRole === 'admin' ? 'Administrador' : 
               activeRole === 'hospital' ? 'Personal Hospitalario' : 
               'Gestante'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          style={{ 
            background: '#CA436E', 
            color: 'white', 
            border: 'none', 
            padding: '6px 12px', 
            borderRadius: '15px', 
            cursor: 'pointer', 
            height: 'fit-content',
            fontSize: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          Cerrar sesión
        </button>

        {alertsOpen && (
          <div className={styles.alertsDropdown}>
            <AlertasPanel />
          </div>
        )}
      </div>
    </header>
    
    <div className={styles.mobileNavWrapper}>
      <MobileBottomNav />
    </div>
    </>
  );
};
