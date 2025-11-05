import { Consejos } from './consejos/Consejos';
import styles from './ContentMain.module.css';
import { Datos } from './datos/Datos';
import { Registros } from './registros/Registros';

export const ContentMain = () => {
  return (
    <section className={styles.container}>
      <div className={styles.informacion_usuario}>
        <p className="">
          Buenas tardes, <h1 className="">Ana Milena</h1>
          <img alt="foto trimestre" src="./image/etapas/primertrimestre.png" />
        </p>
      </div>
      <section className={styles.right}>
        <Datos className={styles.datos} />
        <Consejos className={styles.consejos} />
        <Registros className={styles.registros} />
      </section>
    </section>
  );
};
