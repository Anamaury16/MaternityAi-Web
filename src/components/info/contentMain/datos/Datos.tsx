import { useVitals } from '../../../../hooks/clinical/useClinical';
import { useGestationalAge } from '../../../../hooks/m0/useM0';
import { useNewborns } from '../../../../hooks/m4/useM4';
import styles from './datos.module.css';

interface Props {
  className?: string;
}

export const Datos = ({ className }: Props) => {
  const { data: vitalsData } = useVitals();
  const { data: gestationalData } = useGestationalAge();
  const { data: newborns } = useNewborns();

  const ultimoRegistro = vitalsData.length > 0 ? vitalsData[vitalsData.length - 1] : null;

  // Si ya nació (se registró un recién nacido en el puerperio), se muestran los datos reales.
  // De lo contrario, la información del bebé se muestra vacía/con guiones.
  const datosBebe = newborns.length > 0
    ? {
        tamaño: newborns[0].talla_cm !== null && newborns[0].talla_cm !== undefined ? newborns[0].talla_cm.toString() : '--',
        gramos: newborns[0].peso_gramos !== null && newborns[0].peso_gramos !== undefined ? newborns[0].peso_gramos.toLocaleString('es-ES') : '--'
      }
    : {
        tamaño: '--',
        gramos: '--'
      };

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
            <h4>ALTURA UTERINA</h4>
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
            <p>
              {datosBebe.gramos} {datosBebe.gramos !== '--' && <span>g</span>}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
