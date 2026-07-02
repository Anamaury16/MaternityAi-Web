import { useVitals } from '../../../../hooks/clinical/useClinical';
import { useGestationalAge } from '../../../../hooks/m0/useM0';
import styles from './datos.module.css';

interface Props {
  className?: string;
}

const obtenerDatosBebe = (semanas: number | undefined) => {
  if (semanas === undefined || semanas < 1) return { tamaño: '--', gramos: '--' };

  // Tabla estándar de desarrollo fetal (Semanas vs [Tamaño cm, Peso gramos])
  const tablaFetal: Record<number, [number, number]> = {
    1: [0.1, 1], 2: [0.1, 1], 3: [0.1, 1], 4: [0.1, 1],
    5: [0.2, 1], 6: [0.5, 1], 7: [1.0, 1], 8: [1.6, 1],
    9: [2.3, 2], 10: [3.1, 4], 11: [4.1, 7], 12: [5.4, 14],
    13: [7.4, 23], 14: [8.7, 43], 15: [10.1, 70], 16: [11.6, 100],
    17: [13.0, 140], 18: [14.2, 190], 19: [15.3, 240], 20: [25.6, 300],
    21: [26.7, 360], 22: [27.8, 430], 23: [28.9, 500], 24: [30.0, 600],
    25: [34.6, 660], 26: [35.6, 760], 27: [36.6, 875], 28: [37.6, 1000],
    29: [38.6, 1150], 30: [39.9, 1300], 31: [41.1, 1500], 32: [42.4, 1700],
    33: [43.7, 1900], 34: [45.0, 2100], 35: [46.2, 2380], 36: [47.4, 2620],
    37: [48.6, 2860], 38: [49.8, 3080], 39: [50.7, 3290], 40: [51.2, 3460],
    41: [51.7, 3600], 42: [52.0, 3700]
  };

  const semanasClave = Math.min(Math.max(Math.round(semanas), 1), 42);
  const [tamaño, gramos] = tablaFetal[semanasClave] || [0.1, 1];

  return {
    tamaño: tamaño.toString(),
    gramos: gramos.toLocaleString('es-ES')
  };
};

export const Datos = ({ className }: Props) => {
  const { data: vitalsData } = useVitals();
  const { data: gestationalData } = useGestationalAge();
  
  const ultimoRegistro = vitalsData.length > 0 ? vitalsData[vitalsData.length - 1] : null;
  const datosBebe = obtenerDatosBebe(gestationalData?.semanas);

  return (
    <section className={`${styles.container} ${className ?? ''}`}>
      <div className={styles.tarjeta}>
        <h3>Mis datos</h3>
        <div className={styles.mis_datos}>
          <div className={styles.datos}>
            <h4>PESO</h4>
            <p>
              {ultimoRegistro?.peso_kg || '--'} <span>kg</span>
            </p>
          </div>

          <div className={styles.datos}>
            <h4>ALTURA</h4>
            <p>
              {ultimoRegistro?.altura_uterina || '--'} <span>cm</span>
            </p>
          </div>

          <div className={styles.datos}>
            <h4>TALLA </h4>
            <p>
              {ultimoRegistro?.talla_cm || '--'} <span>cm</span>
            </p>
          </div>
        </div>
      </div>

      <div className={styles.tarjeta}>
        <h3>Datos del bebé</h3>
        <div className={styles.datos_bebe}>
          <div className={styles.datos}>
            <h4>TAMAÑO</h4>
            <p>
              {datosBebe.tamaño} <span>cm</span>
            </p>
          </div>
          <div className={styles.datos}>
            <h4>GRAMOS</h4>
            <p>{datosBebe.gramos}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
