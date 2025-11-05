import styles from './datos.module.css';

interface Props {
  className?: string;
}
export const Datos = ({ className }: Props) => {
  return (
    <section className={`${styles.container} ${className ?? ''}`}>
      <div className={styles.tarjeta}>
        <h3>Mis datos</h3>
        <div className={styles.mis_datos}>
          <div className={styles.datos}>
            <h4>PESO</h4>
            <p>
              67 <span>kg</span>
            </p>
          </div>

          <div className={styles.datos}>
            <h4>ALTURA</h4>
            <p>
              1,67 <span>M</span>
            </p>
          </div>

          <div className={styles.datos}>
            <h4>EDAD</h4>
            <p>
              20 <span>Años</span>
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
              92 <span>CM</span>
            </p>
          </div>
          <div className={styles.datos}>
            <h4>GRAMOS</h4>
            <p>1.200</p>
          </div>
        </div>
      </div>
    </section>
  );
};
