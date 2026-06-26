import { useState, useEffect } from 'react';
import { Consejos } from './consejos/Consejos';
import styles from './ContentMain.module.css';
import { Datos } from './datos/Datos';
import { Registros } from './registros/Registros';
import { SvgBell, SvgSparkle } from '../../Icons/IconsSystem';
import { getActiveModule, getModuleHistory, type ModuleHistoryEntry as ModuleHistory } from '../../../services/m0Service';
import { useGestationalAge } from '../../../hooks/m0/useM0';
import { ProgressChecklist } from './progressChecklist/ProgressChecklist';
import { RiskSummaryCard } from './RiskSummaryCard/RiskSummaryCard';
import { ReporteModal } from './registros/reportarsignos/ReporteModal';
import { useSymptoms } from '../../../hooks/clinical/useClinical';
import { useChecklist } from '../../../hooks/m5/usM5';
import { PostpartumDashboard } from './postpartum/PostpartumDashboard';
import { useBirthRecord } from '../../../hooks/m4/useM4';
import { AlertasPanel } from '../../alertas/AlertasPanel';

export const ContentMain = () => {
  const [alertsOpen, setAlertsOpen] = useState(false);
  const userName = localStorage.getItem('user_name') || 'Gestante';
  const displayId = userName.replace('Gestante ', '');
  const { data } = useGestationalAge();
  const { data: birthData } = useBirthRecord();

  const calcularDiasPosparto = () => {
    if (!birthData?.fecha_parto) return null;
    const fechaPartoDate = new Date(birthData.fecha_parto);
    const hoy = new Date();
    const diferenciaMs = hoy.getTime() - fechaPartoDate.getTime();
    const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
    return dias >= 0 ? dias : 0;
  };
  const diasPosparto = calcularDiasPosparto();

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

  const [activeModule, setActiveModule] = useState<{
    modulo_id: number;
    codigo: string;
    nombre: string;
    semana_gestacion_actual: number;
  } | null>(null);
  const [historyList, setHistoryList] = useState<ModuleHistory[]>([]);

  const [symptomsModalOpen, setSymptomsModalOpen] = useState(false);
  const { report: reportSymptoms, loading: symptomsLoading, error: symptomsError } = useSymptoms();
  const { data: checklistData, loading: checklistLoading } = useChecklist();

  const handleSymptomsSubmit = async (
    descripcion: string,
    severidad: 'leve' | 'moderado' | 'severo' | null,
  ) => {
    await reportSymptoms({ descripcion, severidad: severidad ?? undefined });
    setSymptomsModalOpen(false);
  };

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
            <p style={{margin: 0}}>{mensajeTiempo()}, </p>
            <h1 className="">{userName} 👋</h1>
            {activeModule?.codigo === 'M4' ? (
              <div className={styles.seccion_informacion}>
                <div className={styles.semanas}>
                  <h2>{diasPosparto !== null ? `${diasPosparto} días` : 'Pendiente'}</h2>
                  <p>Posparto / Recuperación</p>
                </div>
                <img alt="foto posparto" src="./image/etapas/primertrimestre.png" loading="lazy" decoding="async" />
              </div>
            ) : (
              <div className={styles.seccion_informacion}>
                <div className={styles.semanas}>
                  <h2>{data?.semanas || '--'}/{calcularTrimestre(data?.semanas)*12}</h2>
                  <p>Semanas de embarazo</p>
                </div>
                <img alt="foto trimestre" src="./image/etapas/primertrimestre.png" loading="lazy" decoding="async" />
              </div>
            )}
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
          {activeModule?.codigo === 'M4' && <PostpartumDashboard />}
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
              {mensajeTiempo()},<br />
              <strong>{displayId}</strong> 👋
            </div>
            <div 
              className={styles.mobileBell} 
              onClick={() => setAlertsOpen(!alertsOpen)} 
              style={{ cursor: 'pointer' }}
            >
              <SvgBell />
              <span className={styles.notificationDot}></span>
            </div>
          </div>
        </div>

        {alertsOpen && (
          <div className={styles.mobileAlertsOverlay}>
            <AlertasPanel />
          </div>
        )}

        <div className={styles.mobileCard}>
          {activeModule?.codigo === 'M4' ? (
            <>
              <div className={styles.weeksCounter}>
                <span className={styles.weekCenter}>{diasPosparto !== null ? `${diasPosparto}` : '--'}</span>
              </div>
              <div className={styles.weeksLabel}>Días Posparto</div>
            </>
          ) : (
            <>
              <div className={styles.weeksCounter}>
                <span className={styles.weekSide}>{data?.semanas ? data.semanas - 1 : 27}</span>
                <span className={styles.weekCenter}>{data?.semanas || 28}</span>
                <span className={styles.weekSide}>{data?.semanas ? data.semanas + 1 : 29}</span>
                <span className={styles.weekSide}>{data?.semanas ? data.semanas + 2 : 30}</span>
              </div>
              <div className={styles.weeksLabel}>Semanas</div>
            </>
          )}

          <button className={styles.sintomasBtn} onClick={() => setSymptomsModalOpen(true)}>
            Sintomas criticos
            <div className={styles.sintomasIcon}>
              <SvgSparkle width={18} height={18} fill="white" />
            </div>
          </button>

          <div className={styles.preparacionSeccion}>
            <h4>Preparacion para el parto</h4>
            {checklistLoading ? (
              <p style={{fontSize: '14px', color: '#666'}}>Cargando...</p>
            ) : checklistData?.items?.length ? (
              checklistData.items.slice(0, 2).map((item) => (
                <div key={item.id} className={styles.prepItem}>
                  <span className={styles.prepLabel}>
                    {item.texto} {item.completado && '✅'}
                  </span>
                  <div className={styles.prepCard}></div>
                </div>
              ))
            ) : (
              <p style={{fontSize: '14px', color: '#666'}}>No hay items pendientes</p>
            )}
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

          {activeModule?.codigo === 'M4' && (
            <div style={{ width: '100%', margin: '20px 0 0 0' }}>
              <PostpartumDashboard />
            </div>
          )}

          {/* Alertas Panel Mobile (movido al header) */}

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

      {symptomsModalOpen && (
        <ReporteModal
          loading={symptomsLoading}
          error={symptomsError}
          onClose={() => setSymptomsModalOpen(false)}
          onSubmit={handleSymptomsSubmit}
        />
      )}
    </section>
  );
};
