import { useState, useEffect } from 'react';
import { Consejos } from './consejos/Consejos';
import styles from './ContentMain.module.css';
import { Datos } from './datos/Datos';
import { Registros } from './registros/Registros';
import { SvgBell, SvgSparkle } from '../../Icons/IconsSystem';
import { getActiveModule, type ActiveModule } from '../../../services/m0Service';
import { useGestationalAge } from '../../../hooks/m0/useM0';

import { ReporteModal } from './registros/reportarsignos/ReporteModal';
import { useSymptoms } from '../../../hooks/clinical/useClinical';
import { useChecklist } from '../../../hooks/m5/usM5';
import { PostpartumDashboard } from './postpartum/PostpartumDashboard';
import { useBirthRecord } from '../../../hooks/m4/useM4';
import { AlertasPanel } from '../../alertas/AlertasPanel';
import { Modal } from '../../Modal';
import { RiskSummaryCard } from './RiskSummaryCard/RiskSummaryCard';
import { useRiskSummary } from '../../../hooks/ia/useRiskSummary';
import { PwaInstallPrompt } from '../../pwa/PwaInstallPrompt';

export const ContentMain = () => {
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const { summary } = useRiskSummary();
  const riskLevel = summary?.nivel_riesgo || 'verde';

  const userName = localStorage.getItem('user_name') || 'Gestante';
  const displayId = userName.replace('Gestante ', '');
  const { data, refresh: refreshGestationalAge } = useGestationalAge();
  const { data: birthData, refresh: refreshBirth } = useBirthRecord();

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

  const [activeModule, setActiveModule] = useState<ActiveModule | null>(null);

  const [symptomsModalOpen, setSymptomsModalOpen] = useState(false);
  const { report: reportSymptoms, loading: symptomsLoading, error: symptomsError } = useSymptoms();
  const { data: checklistData, loading: checklistLoading, updateItem } = useChecklist();
  const [showAllChecklist, setShowAllChecklist] = useState(false);

  // Estados para el registro de parto y recién nacido desde el modal
  const [registerBirthOpen, setRegisterBirthOpen] = useState(false);

  const handleSymptomsSubmit = async (
    descripcion: string,
    severidad: 'leve' | 'moderado' | 'severo' | null,
  ) => {
    let capitalizedSeveridad: 'Leve' | 'Moderado' | 'Severo' | undefined = undefined;
    if (severidad === 'leve') capitalizedSeveridad = 'Leve';
    else if (severidad === 'moderado') capitalizedSeveridad = 'Moderado';
    else if (severidad === 'severo') capitalizedSeveridad = 'Severo';

    await reportSymptoms({ descripcion, severidad: capitalizedSeveridad });
    setSymptomsModalOpen(false);
  };

  const loadData = async () => {
    try {
      refreshBirth();
      refreshGestationalAge();
      const activeData = await getActiveModule();
      setActiveModule(activeData);
    } catch (err) {
      console.error("Error loading active module:", err);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('maternity-active-module-changed', loadData);
    return () => {
      window.removeEventListener('maternity-active-module-changed', loadData);
    };
  }, []);

  return (
    <section className={styles.container}>
      {/* --- DESKTOP VIEW --- */}
      <div className={styles.desktopView}>
        <div className={styles.informacion_usuario}>
          <div className="">
            <p style={{margin: 0}}>{mensajeTiempo()}, </p>
            <h1 className="">{userName}</h1>
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
          <Datos className={styles.datos} />
          <Consejos 
            className={styles.consejos} 
            activeModule={activeModule}
            birthData={birthData}
            weeks={data?.semanas}
            onRegisterBirth={() => {
              setRegisterBirthOpen(true);
            }}
          />
          <Registros className={styles.registros} />
        </section>
      </div>

      {/* --- MOBILE VIEW --- */}
      <div className={styles.mobileView}>
        <div className={styles.mobileHeaderBg}>
          <div className={styles.mobileHeaderContent}>
            <div className={styles.mobileGreeting}>
              {mensajeTiempo()},<br />
              <strong>{displayId}</strong>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button 
                onClick={() => setIsRiskModalOpen(true)}
                title="Semáforo de Riesgo IA"
                aria-label="Semáforo de Riesgo IA"
                style={{
                  background: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}
              >
                <span style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  backgroundColor: riskLevel === 'rojo' ? '#ef4444' : riskLevel === 'amarillo' ? '#f59e0b' : '#10b981',
                  boxShadow: riskLevel === 'rojo' 
                    ? '0 0 8px #ef4444' 
                    : riskLevel === 'amarillo' 
                    ? '0 0 8px #f59e0b' 
                    : '0 0 8px #10b981',
                }} />
              </button>
              <button 
                onClick={() => {
                  setRegisterBirthOpen(true);
                }}
                title="Mi Bebé / Parto"
                aria-label="Mi Bebé / Parto"
                style={{
                  background: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  color: '#ca436e'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12h.01" />
                  <path d="M15 12h.01" />
                  <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" />
                  <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 5 6.3" />
                  <path d="M12 2v2" />
                </svg>
              </button>
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
        </div>

        {alertsOpen && (
          <div className={styles.mobileAlertsOverlay}>
            <AlertasPanel />
          </div>
        )}

        <div className={styles.mobileCard}>
          <PwaInstallPrompt />
          {(activeModule?.codigo === 'M4' || birthData) ? (
            <>
              <div className={styles.weeksCounter}>
                <span className={styles.weekCenter}>{diasPosparto !== null ? `${diasPosparto}` : '--'}</span>
              </div>
              <div className={styles.weeksLabel}>Días Posparto</div>
              {activeModule && (
                <div className={styles.mobileTrimestreLabel}>{activeModule.nombre}</div>
              )}
              {/* Progreso del Puerperio/Recuperación (Minimalista) */}
              <div style={{ width: '100%', padding: '0 8px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', marginBottom: '4px', fontWeight: '500' }}>
                  <span>Día {diasPosparto || 0} de 42</span>
                  <span style={{ color: '#ca436e', fontWeight: '600' }}>{diasPosparto !== null ? Math.min(Math.round((diasPosparto / 42) * 100), 100) : 0}%</span>
                </div>
                <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(223, 93, 134, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${diasPosparto !== null ? Math.min((diasPosparto / 42) * 100, 100) : 0}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #df5d86, #ca436e)',
                    borderRadius: '2px',
                    transition: 'width 0.5s ease-out'
                  }} />
                </div>
              </div>
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
              {/* Progreso de la Gestación (Minimalista) */}
              <div style={{ width: '100%', padding: '0 8px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', marginBottom: '4px', fontWeight: '500' }}>
                  <span>Semana {data?.semanas || 28} de 40</span>
                  <span style={{ color: '#ca436e', fontWeight: '600' }}>{data?.semanas ? Math.min(Math.round((data.semanas / 40) * 100), 100) : 70}%</span>
                </div>
                <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(223, 93, 134, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${data?.semanas ? Math.min((data.semanas / 40) * 100, 100) : 70}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #df5d86, #ca436e)',
                    borderRadius: '2px',
                    transition: 'width 0.5s ease-out'
                  }} />
                </div>
              </div>
            </>
          )}

          {/* Botón superior de acceso rápido para parto o bebé en el móvil */}
          <div style={{ width: '100%', padding: '0 8px', marginBottom: '15px' }}>
            {activeModule?.codigo === 'M4' || birthData ? (
              <button 
                onClick={() => {
                  setRegisterBirthOpen(true);
                }}
                className={styles.topActionBtn}
              >
                🍼 Control de Posparto
              </button>
            ) : (
              (activeModule?.codigo === 'M3' || (data?.semanas && data.semanas >= 28)) && (
                <button 
                  onClick={() => {
                    setRegisterBirthOpen(true);
                  }}
                  className={styles.topActionBtn}
                >
                  👶 ¿Ya nació tu bebé? Registrar Parto
                </button>
              )
            )}
          </div>

          <button className={styles.sintomasBtn} onClick={() => setSymptomsModalOpen(true)}>
            Sintomas criticos
            <div className={styles.sintomasIcon}>
              <SvgSparkle width={18} height={18} fill="white" />
            </div>
          </button>

          <div className={styles.preparacionSeccion}>
            <h4 style={{ marginBottom: '8px' }}>Preparación para el parto</h4>
            {(() => {
              const completedChecklistItems = checklistData?.items?.filter(item => item.completado).length || 0;
              const totalChecklistItems = checklistData?.items?.length || 0;
              const checklistProgressPercent = totalChecklistItems > 0 
                ? Math.round((completedChecklistItems / totalChecklistItems) * 100) 
                : 0;

              return totalChecklistItems > 0 ? (
                <div style={{ width: '100%', marginBottom: '14px', padding: '0 4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', marginBottom: '4px', fontWeight: '500' }}>
                    <span>Tareas</span>
                    <span style={{ color: '#df5d86', fontWeight: '600' }}>{checklistProgressPercent}% ({completedChecklistItems}/{totalChecklistItems})</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(223, 93, 134, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${checklistProgressPercent}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #df5d86 0%, #ca436e 100%)',
                      borderRadius: '2px',
                      transition: 'width 0.4s ease-out'
                    }} />
                  </div>
                </div>
              ) : null;
            })()}
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



          {/* Alertas Panel Mobile (movido al header) */}






        </div>
      </div>

      {isRiskModalOpen && (
        <Modal 
          isOpen={isRiskModalOpen} 
          onClose={() => setIsRiskModalOpen(false)} 
          title="Semáforo de Riesgo IA"
        >
          <div style={{ padding: '5px' }}>
            <RiskSummaryCard />
          </div>
        </Modal>
      )}

      {symptomsModalOpen && (
        <ReporteModal
          loading={symptomsLoading}
          error={symptomsError}
          onClose={() => setSymptomsModalOpen(false)}
          onSubmit={handleSymptomsSubmit}
        />
      )}

      {registerBirthOpen && (
        <Modal 
          isOpen={registerBirthOpen} 
          onClose={() => {
            setRegisterBirthOpen(false);
            loadData();
          }} 
          title="Control de Posparto"
        >
          <div style={{ padding: '10px' }}>
            <PostpartumDashboard inModal={true} onBirthSaved={loadData} />
          </div>
        </Modal>
      )}
    </section>
  );
};
