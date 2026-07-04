import { useState, useEffect } from 'react';
import { Consejos } from './consejos/Consejos';
import styles from './ContentMain.module.css';
import { Datos } from './datos/Datos';
import { Registros } from './registros/Registros';
import { SvgBell, SvgSparkle } from '../../Icons/IconsSystem';
import { getActiveModule } from '../../../services/m0Service';
import { useGestationalAge } from '../../../hooks/m0/useM0';

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



  const getEtapaImage = (moduloCodigo: string | undefined, semanas: number | undefined): string => {
    if (moduloCodigo === 'M4') return './image/etapas/puerperio.png';
    const s = semanas ?? 0;
    if (s <= 13) return './image/etapas/primertrimestre.png';
    if (s <= 36) return './image/etapas/tercertrimestre.png';
    return './image/etapas/parto.png';
  };

  const [activeModule, setActiveModule] = useState<{
    modulo_id: number;
    codigo: string;
    nombre: string;
    semana_gestacion_actual: number;
  } | null>(null);

  const [symptomsModalOpen, setSymptomsModalOpen] = useState(false);
  const { report: reportSymptoms, loading: symptomsLoading, error: symptomsError } = useSymptoms();
  const { data: checklistData, loading: checklistLoading, updateItem } = useChecklist();
  const [showAllChecklist, setShowAllChecklist] = useState(false);

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
        const activeData = await getActiveModule();
        setActiveModule(activeData);
      } catch (err) {
        console.error("Error loading active module:", err);
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
              <>
                <div className={styles.seccion_informacion}>
                  <div className={styles.semanas}>
                    <h2>{diasPosparto !== null ? `${diasPosparto} días` : 'Pendiente'}</h2>
                    <p>Posparto / Recuperación</p>
                  </div>
                  <img alt="foto posparto" src={getEtapaImage(activeModule?.codigo, undefined)} loading="lazy" decoding="async" />
                </div>
                {activeModule && (
                  <div className={styles.trimestreLabelOuter}>{activeModule.nombre}</div>
                )}
              </>
            ) : (
              <>
                <div className={styles.seccion_informacion}>
                  <div className={styles.semanas}>
                    <h2>{data?.semanas || '--'}/40</h2>
                    <p>Semanas</p>
                  </div>
                  <img alt="foto trimestre" src={getEtapaImage(activeModule?.codigo, data?.semanas)} loading="lazy" decoding="async" />
                </div>
                {activeModule && (
                  <div className={styles.trimestreLabelOuter}>{activeModule.nombre}</div>
                )}
              </>
            )}
          </div>








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
              {activeModule && (
                <div className={styles.mobileTrimestreLabel}>{activeModule.nombre}</div>
              )}
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
              {activeModule && (
                <div className={styles.mobileTrimestreLabel}>{activeModule.nombre}</div>
              )}
            </>
          )}

          <button className={styles.sintomasBtn} onClick={() => setSymptomsModalOpen(true)}>
            Sintomas criticos
            <div className={styles.sintomasIcon}>
              <SvgSparkle width={18} height={18} fill="white" />
            </div>
          </button>

          <div className={styles.preparacionSeccion}>
            <h4>Preparación para el parto</h4>
            {checklistLoading ? (
              <p style={{fontSize: '14px', color: '#666'}}>Cargando checklist...</p>
            ) : checklistData?.items?.length ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {(showAllChecklist ? checklistData.items : checklistData.items.slice(0, 2)).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => updateItem(item.id, { completado: !item.completado })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px',
                        background: item.completado ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : '#ffffff',
                        border: item.completado ? '1px solid #bbf7d0' : '1px solid #e5e7eb',
                        borderRadius: '16px',
                        marginBottom: '10px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          border: item.completado ? '2px solid #22c55e' : '2px solid #9ca3af',
                          background: item.completado ? '#22c55e' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          flexShrink: 0,
                        }}
                      >
                        {item.completado && '✓'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '13.5px',
                            fontWeight: 500,
                            color: item.completado ? '#166534' : '#1f2937',
                            textDecoration: item.completado ? 'line-through' : 'none',
                            lineHeight: '1.4',
                          }}
                        >
                          {item.texto}
                        </p>
                        {item.semana_eg && (
                          <span
                            style={{
                              display: 'inline-block',
                              marginTop: '6px',
                              padding: '2px 8px',
                              background: item.completado ? '#dcfce7' : '#f3f4f6',
                              color: item.completado ? '#15803d' : '#4b5563',
                              borderRadius: '12px',
                              fontSize: '10.5px',
                              fontWeight: 500,
                            }}
                          >
                            Semana {item.semana_eg}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {checklistData.items.length > 2 && (
                  <button
                    onClick={() => setShowAllChecklist(!showAllChecklist)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#CA436E',
                      fontWeight: 600,
                      fontSize: '13px',
                      marginTop: '8px',
                      cursor: 'pointer',
                      padding: '4px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {showAllChecklist ? 'Ver menos ↑' : `Ver todos (${checklistData.items.length}) ↓`}
                  </button>
                )}
              </>
            ) : (
              <p style={{fontSize: '14px', color: '#666'}}>No hay ítems configurados</p>
            )}
          </div>



          {activeModule?.codigo === 'M4' && (
            <div style={{ width: '100%', margin: '20px 0 0 0' }}>
              <PostpartumDashboard />
            </div>
          )}

          {/* Alertas Panel Mobile (movido al header) */}






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
