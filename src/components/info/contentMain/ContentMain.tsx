import { useState, useEffect } from 'react';
import { Consejos } from './consejos/Consejos';
import styles from './ContentMain.module.css';
import { Datos } from './datos/Datos';
import { Registros } from './registros/Registros';
import { SvgBell, SvgSparkle } from '../../Icons/IconsSystem';
import { getActiveModule, getModuleHistory, type ModuleHistoryEntry as ModuleHistory } from '../../../services/m0Service';
import { ProgressChecklist } from './progressChecklist/ProgressChecklist';
import { RiskSummaryCard } from './RiskSummaryCard/RiskSummaryCard';

export const ContentMain = () => {
  const userName = localStorage.getItem('user_name') || 'Gestante';
  const displayId = userName.replace('Gestante ', '');

  const [activeModule, setActiveModule] = useState<{
    modulo_id: number;
    codigo: string;
    nombre: string;
    semana_gestacion_actual: number;
  } | null>(null);
  const [historyList, setHistoryList] = useState<ModuleHistory[]>([]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const [activeData, historyData] = await Promise.all([
          getActiveModule(),
          getModuleHistory()
        ]);
        setActiveModule(activeData);
        setHistoryList(historyData);
      } catch (err) {
        console.error("Error loading active module and history:", err);
      }
    };
    loadData();
  }, []);

  return (
    <section className={styles.container}>
      {/* --- DESKTOP VIEW --- */}
      <div className={styles.desktopView}>
        <div className={styles.informacion_usuario}>
          <div className="">
            Buenas tardes, <h1 className="">{userName}</h1>
            <img alt="foto trimestre" src="./image/etapas/primertrimestre.png" loading="lazy" decoding="async" />
          </div>

          {/* Active Module Card */}
          {activeModule && (
            <div className={styles.activeModuleCard}>
              <div className={styles.activeModuleHeader}>
                <h3>Módulo Clínico Activo</h3>
                <span className={styles.moduleBadge}>{activeModule.codigo}</span>
              </div>
              <h2 className={styles.activeModuleTitle}>{activeModule.nombre}</h2>
              <p className={styles.activeModuleMeta}>
                Semana de gestación actual: <strong>{activeModule.semana_gestacion_actual}</strong>
              </p>
            </div>
          )}

          {/* Semáforo de riesgo IA */}
          <RiskSummaryCard />

          {/* Checklist de Progreso */}
          {activeModule && (
            <ProgressChecklist
              moduloId={activeModule.modulo_id}
              moduloCodigo={activeModule.codigo}
            />
          )}

          {/* Module Changes History */}
          {historyList.length > 0 && (
            <div className={styles.historyCard}>
              <h3>Historial de Cambios</h3>
              <div className={styles.historyList}>
                {historyList.map((item) => (
                  <div key={item.id} className={styles.historyItem}>
                    <div className={styles.historyPills}>
                      <span className={styles.pillNew}>{item.modulo_nuevo}</span>
                      {item.modulo_anterior && (
                        <span className={styles.pillOld}>{item.modulo_anterior}</span>
                      )}
                    </div>
                    <div className={styles.historyDetails}>
                      <p>{item.motivo}</p>
                      <span>Origen: {item.origen} | {new Date(item.created_at).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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

          {/* Active Module Mobile */}
          {activeModule && (
            <div className={styles.activeModuleCard} style={{ width: '100%', maxWidth: 'none', margin: '20px 0 0 0' }}>
              <div className={styles.activeModuleHeader}>
                <h3>Módulo Clínico Activo</h3>
                <span className={styles.moduleBadge}>{activeModule.codigo}</span>
              </div>
              <h2 className={styles.activeModuleTitle} style={{ fontSize: '1.6rem' }}>{activeModule.nombre}</h2>
              <p className={styles.activeModuleMeta}>Semana de gestación actual: {activeModule.semana_gestacion_actual}</p>
            </div>
          )}

          {/* Semáforo de riesgo IA Mobile */}
          <RiskSummaryCard />

          {/* Checklist de Progreso Mobile */}
          {activeModule && (
            <ProgressChecklist
              moduloId={activeModule.modulo_id}
              moduloCodigo={activeModule.codigo}
              style={{ width: '100%', maxWidth: 'none', margin: '15px 0 0 0' }}
            />
          )}

          {/* Module Changes History Mobile */}
          {historyList.length > 0 && (
            <div className={styles.historyCard} style={{ width: '100%', maxWidth: 'none', margin: '15px 0 0 0' }}>
              <h3>Historial de Cambios</h3>
              <div className={styles.historyList}>
                {historyList.map((item) => (
                  <div key={item.id} className={styles.historyItem}>
                    <div className={styles.historyPills}>
                      <span className={styles.pillNew}>{item.modulo_nuevo}</span>
                      {item.modulo_anterior && (
                        <span className={styles.pillOld}>{item.modulo_anterior}</span>
                      )}
                    </div>
                    <div className={styles.historyDetails}>
                      <p>{item.motivo}</p>
                      <span>{new Date(item.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
