import React, { useEffect, useState } from 'react';
import { getObstetricFormula } from '../../services/m0Service';
import type { ObstetricFormula as IObstetricFormula } from '../../services/m0Service';
import styles from './Profile.module.css';

export const ObstetricFormula: React.FC = () => {
  const [formula, setFormula] = useState<IObstetricFormula | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await getObstetricFormula();
      setFormula(data);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return null;

  return (
    <div className={styles.card}>
      <h3>Fórmula Obstétrica</h3>
      <div className={styles.formulaGrid}>
        <div className={styles.formulaItem}>
          <span className={styles.count}>{formula?.gestaciones}</span>
          <label>Gestaciones</label>
        </div>
        <div className={styles.formulaItem}>
          <span className={styles.count}>{formula?.partos}</span>
          <label>Partos</label>
        </div>
        <div className={styles.formulaItem}>
          <span className={styles.count}>{formula?.cesareas}</span>
          <label>Cesáreas</label>
        </div>
        <div className={styles.formulaItem}>
          <span className={styles.count}>{formula?.abortos}</span>
          <label>Abortos</label>
        </div>
        <div className={styles.formulaItem}>
          <span className={styles.count}>{formula?.vivos}</span>
          <label>Vivos</label>
        </div>
      </div>
    </div>
  );
};
