import { Consejos } from './consejos/Consejos';
import styles from './ContentMain.module.css';
import { Datos } from './datos/Datos';
import { Registros } from './registros/Registros';
import { SvgBell, SvgSparkle } from '../../Icons/IconsSystem';
import { useGestationalAge } from '../../../hooks/m0/useM0';

export const ContentMain = () => {
  const userName = localStorage.getItem('user_name') || 'Gestante';
  const displayId = userName.replace('Gestante ', '');
  const {data} = useGestationalAge();

  const mensajeTiempo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  const calcularTrimestre = (semanas: number | undefined) => {
    if (semanas === undefined) return 1;
    if (semanas <= 12) return 2;
    if (semanas <= 24) return 3;
    return 4;
  }

  return (
    <section className={styles.container}>
      {/* --- DESKTOP VIEW --- */}
      <div className={styles.desktopView}>
        <div className={styles.informacion_usuario}>
          <div className="">
            <p style={{margin: 0}}>{mensajeTiempo()}, </p>
            <h1 className="">{userName} 👋</h1>
            <div className={styles.seccion_informacion}>
              <div className={styles.semanas}>
                <h2>{data?.semanas || '--'}/{calcularTrimestre(data?.semanas)*12}</h2>
                <p>Semanas de embarazo</p>
              </div>
              <img alt="foto trimestre" src="./image/etapas/primertrimestre.png" loading="lazy" decoding="async" />
            </div>
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
