import { Consejos } from './consejos/Consejos';
import styles from './ContentMain.module.css';
import { Datos } from './datos/Datos';
import { Registros } from './registros/Registros';
import { SvgBell, SvgSparkle } from '../../Icons/IconsSystem';

export const ContentMain = () => {
  const userName = localStorage.getItem('user_name') || 'Gestante';
  const displayId = userName.replace('Gestante ', '');

  return (
    <section className={styles.container}>
      {/* --- DESKTOP VIEW --- */}
      <div className={styles.desktopView}>
        <div className={styles.informacion_usuario}>
          <div className="">
            Buenas tardes, <h1 className="">{userName}</h1>
            <img alt="foto trimestre" src="./image/etapas/primertrimestre.png" />
          </div>
        </div>
        <section className={styles.right}>
          <Datos className={styles.datos} />
          <Consejos className={styles.consejos} />
          <Registros className={styles.registros} />
        </section>
      </div>

      {/* --- MOBILE VIEW --- */}
      <div className={styles.mobileView}>
        <div className={styles.mobileHeaderBg}>
          <div className={styles.mobileHeaderContent}>
            <div className={styles.mobileGreeting}>
              Buenas tardes,<br />
              <strong>{displayId}</strong> 👋
            </div>
            <div className={styles.mobileBell}>
              <SvgBell />
              <span className={styles.notificationDot}></span>
            </div>
          </div>
        </div>
        
        <div className={styles.mobileCard}>
          <div className={styles.weeksCounter}>
            <span className={styles.weekSide}>27</span>
            <span className={styles.weekCenter}>28</span>
            <span className={styles.weekSide}>29</span>
            <span className={styles.weekSide}>30</span>
          </div>
          <div className={styles.weeksLabel}>Semanas</div>
          
          <button className={styles.sintomasBtn}>
            Sintomas criticos
            <div className={styles.sintomasIcon}>
              <SvgSparkle width={18} height={18} fill="white" />
            </div>
          </button>
          
          <div className={styles.preparacionSeccion}>
            <h4>Preparacion para el parto</h4>
            
            <div className={styles.prepItem}>
              <span className={styles.prepLabel}>Actividad fisica</span>
              <div className={styles.prepCard}></div>
            </div>

            <div className={styles.prepItem}>
              <span className={styles.prepLabel}>Alimentacion balanceada</span>
              <div className={styles.prepCard}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
