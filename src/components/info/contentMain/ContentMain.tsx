import { Consejos } from './consejos/Consejos';
import styles from './ContentMain.module.css';
import { Datos } from './datos/Datos';
import { Registros } from './registros/Registros';

export const ContentMain = () => {
  return (
    <section className={styles.container}>
      <div className={styles.informacion_usuario}>
        <div className={styles.mensaje_bienvendida}>
          Buenas tardes, <h1 className="">34bff32</h1>
        </div>
        <img
          alt="foto trimestre"
          className={styles.foto}
          src="./image/etapas/primertrimestre.png"
        />
      </div>
      <section className={styles.right}>
        <Datos className={styles.datos} />
        <Consejos className={styles.consejos} />
        <Registros className={styles.registros} />
      </section>
    </section>
  );
};
