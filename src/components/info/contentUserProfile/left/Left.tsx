import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../../services/authService';
import styles from './Left.module.css';

interface LeftProps {
  activeTab: 'perfil' | 'privacidad';
  setActiveTab: (tab: 'perfil' | 'privacidad') => void;
}

export const Left = ({ activeTab, setActiveTab }: LeftProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <aside className={styles.container}>
      <h2>Configuraciones</h2>
      <p 
        className={activeTab === 'perfil' ? styles.active : ''} 
        onClick={() => setActiveTab('perfil')}
      >
        Mi perfil
      </p>
      <p 
        className={activeTab === 'privacidad' ? styles.active : ''} 
        onClick={() => setActiveTab('privacidad')}
      >
        Políticas y privacidad
      </p>
      <p onClick={handleLogout} className={styles.logout}>
        Cerrar sesión
      </p>
    </aside>
  );
};
