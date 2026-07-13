import { useVitals } from '../../../../hooks/clinical/useClinical';
import styles from './datos.module.css';

interface Props {
  className?: string;
  activeModule?: { codigo: string; nombre: string } | null;
}

export const Datos = ({ className }: Props) => {
  const { data: vitalsData } = useVitals();

  const ultimoRegistro =
    vitalsData.length > 0 ? vitalsData[vitalsData.length - 1] : null;

  return (
    <section className={`${styles.container} ${className ?? ''}`}>
      <div className={styles.tarjeta}>
        <h3>Información general</h3>
        <div className={styles.mis_datos}>
          <div className={styles.datos}>
            <h4>PESO</h4>
            <p>
              {ultimoRegistro?.peso_kg || '--'} <span>kg</span>
            </p>
          </div>

          <div className={styles.datos}>
            <h4>TALLA </h4>
            <p>
              {ultimoRegistro?.talla_cm || '--'} <span>cm</span>
            </p>
          </div>

          <div className={styles.datos}>
            <h4>IMC</h4>
            <p>{ultimoRegistro?.imc || '--'}</p>
          </div>

          <div className={styles.datos}>
            <h4>FCF</h4>
            <p>{ultimoRegistro?.fcf || '--'}</p>
          </div>

          <div className={styles.datos}>
            <h4>ALTURA UTERINA</h4>
            <p>
              {ultimoRegistro?.altura_uterina || '--'} <span>cm</span>
            </p>
          </div>

          <div className={styles.datos}>
            <h4>PRESIÓN DIASTOLICA</h4>
            <p>{ultimoRegistro?.presion_diastolica || '--'}</p>
          </div>
          <div className={styles.datos}>
            <h4>PRESIÓN SISTOLICA</h4>
            <p>{ultimoRegistro?.presion_sistolica || '--'}</p>
          </div>
          <div className={styles.datos}>
            <h4>FECHA CONTROL</h4>
            <p>{ultimoRegistro?.fecha_control || '--'}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
