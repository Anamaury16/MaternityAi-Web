import { useNavigate } from 'react-router-dom';
import styles from './Descubrimiento.module.css';
export const Descubrimiento = () => {
  const navigate = useNavigate();
  return (
    <section onClick={() => navigate('/ai')} className={styles.card}>
      <h3>Descubrimiento</h3>
      <p>Conoce las mejores recomendaciones generadas por IA.</p>
    </section>
  );
};
