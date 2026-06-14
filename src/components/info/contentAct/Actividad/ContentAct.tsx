import { useDailyQuestions } from '../../../../hooks/clinical/useClinical';
import { Notificacion, NotificacionSkeleton } from '../Notificacion/Notificacion';
import { Mensaje } from '../Mensaje/Mensaje';
import styles from './ContentAct.module.css';
import { NotificacionesPanel } from '../Notificacionespanel/Notificacionespanel';

export const ContentAct = () => {
  const { history, loading } = useDailyQuestions();

  const emptyState = !loading && history.length === 0;

  return (
    <div className={styles.mainWrapper}>

      {/* --- DESKTOP VIEW --- */}
      <div className={styles.desktopView}>
        <div className={styles.container}>

          {/* Izquierda — historial de encuestas */}
          <div className={styles.left}>
            <Mensaje />
            <div className={styles.notificaciones}>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <NotificacionSkeleton key={i} />
                ))
              ) : emptyState ? (
                <p className={styles.empty}>Aún no has respondido ninguna encuesta.</p>
              ) : (
                history.map(item => (
                  <Notificacion key={item.id} item={item} />
                ))
              )}
            </div>
          </div>

          {/* Derecha — alertas y notificaciones M6 */}
          <div className={styles.right}>
            <NotificacionesPanel />
          </div>

        </div>
      </div>

      {/* --- MOBILE VIEW --- */}
      <div className={styles.mobileView}>
        <div className={styles.mobileHeader}>
          <Mensaje />
        </div>

        <h2 className={styles.mobileSectionTitle}>Cuestionarios</h2>
        <div className={styles.cuestionariosCarousel}>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <NotificacionSkeleton key={i} />
            ))
          ) : emptyState ? (
            <p className={styles.empty}>Sin encuestas aún.</p>
          ) : (
            history.slice(0, 6).map(item => (
              <Notificacion key={item.id} item={item} />
            ))
          )}
        </div>

        <h2 className={styles.mobileSectionTitle}>Alertas y Notificaciones</h2>
        <div className={styles.mobileSms}>
          <NotificacionesPanel />
        </div>
      </div>

    </div>
  );
};