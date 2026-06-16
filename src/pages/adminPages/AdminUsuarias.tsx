import { useState, useEffect } from 'react';
import { HeaderActividad } from '../../components/Headers/HeaderActividad/HeaderActividad';
import styles from '../../components/admin/AdminUsuarias.module.css';
import modalStyles from './StaffModal.module.css';
import { Modal } from '../../components/Modal';
import { FormRegister } from '../../components/info/contenteregister/FormRegister';
import { useAuth } from '../../context/AuthContext';
import {
  createStaffUser,
  getRoles,
  getStaffUsers,
  updateStaffStatus,
  updateStaffUser,
  getGestantes,
  getGestanteExams,
  getGestanteAlarmSigns,
  getGestanteDailyQuestionsHistory,
  createGestanteEmergencyCall,
  type GestanteResponse,
  type RoleOption,
  type ExamenResponse,
  type AlertaAdminResponse,
  type RespuestaConPreguntaResponse,
  type LlamadaEmergenciaCreate,
} from '../../services/adminService';
import {
  getObstetricFormula,
  updateObstetricFormula,
  getPathologicalHistory,
  createPathologicalHistory,
  updatePathologicalHistory,
  deletePathologicalHistory,
  type ObstetricFormula as IObstetricFormula,
  type PathologicalHistory as IPathologicalHistory,
} from '../../services/m0Service';

// ─── Modal de creación de staff ──────────────────────────────────────────────

const EMPTY_FORM: any = {
  nombre: '',
  email: '',
  password: '',
  rol_id: 2,
};

const StaffCreateModal = ({ onClose }: { onClose: () => void }) => {
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
      getRoles()
      .then((data) => {
        // Solo mostrar Admin, Clínico y Hospital en el selector de staff
        setRoles(data.filter((r) => r.nombre !== 'gestante' && r.nombre !== 'investigador'));
      })
      .catch(() => {
        // Fallback con roles estáticos si el backend no responde
        setRoles([
          { id: 2, nombre: 'clinico' },
          { id: 3, nombre: 'admin' },
          { id: 4, nombre: 'hospital' },
        ]);
      });
  }, []);

  const handleChange = (
    key: string,
    value: string | number | null
  ) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }
    setIsLoading(true);
    try {
      await createStaffUser(form);
      setSuccess(true);
      setTimeout(() => {
        setForm(EMPTY_FORM);
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      const backendError = err.response?.data?.detail;
      setError(typeof backendError === 'string' ? backendError : 'No se pudo crear el usuario. Verifica los datos e intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const rolSeleccionado = roles.find((r) => r.id === form.rol_id);

  return (
    <form onSubmit={handleSubmit} className={modalStyles.form}>
      {success && (
        <div className={modalStyles.successBanner}>
          ✅ Usuario creado exitosamente
        </div>
      )}

      <div className={modalStyles.field}>
        <label className={modalStyles.label}>Nombre completo *</label>
        <input
          className={modalStyles.input}
          type="text"
          placeholder="Ej. Dra. Ana García"
          value={form.nombre}
          onChange={(e) => handleChange('nombre', e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className={modalStyles.field}>
        <label className={modalStyles.label}>Correo electrónico *</label>
        <input
          className={modalStyles.input}
          type="email"
          placeholder="correo@hospital.com"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className={modalStyles.field}>
        <label className={modalStyles.label}>Contraseña *</label>
        <input
          className={modalStyles.input}
          type="password"
          placeholder="Mínimo 8 caracteres"
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className={modalStyles.field}>
        <label className={modalStyles.label}>Rol *</label>
        <select
          className={modalStyles.select}
          value={form.rol_id}
          onChange={(e) => handleChange('rol_id', Number(e.target.value))}
          disabled={isLoading}
        >
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nombre.charAt(0).toUpperCase() + r.nombre.slice(1)}
            </option>
          ))}
        </select>
        {rolSeleccionado && (
          <span className={modalStyles.rolBadge}>
            {rolSeleccionado.nombre === 'admin' && '🛡️ Administrador del sistema'}
            {rolSeleccionado.nombre === 'clinico' && '🩺 Profesional de salud'}
            {rolSeleccionado.nombre === 'investigador' && '🔬 Acceso a datos de investigación'}
            {rolSeleccionado.nombre === 'hospital' && '🏥 Personal Hospitalario (Alertas)'}
          </span>
        )}
      </div>

      {error && (
        <p className={modalStyles.error}>{error}</p>
      )}

      <div className={modalStyles.actions}>
        <button
          type="button"
          className={modalStyles.cancelBtn}
          onClick={onClose}
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={modalStyles.submitBtn}
          disabled={isLoading}
        >
          {isLoading ? 'Creando...' : 'Crear Usuario'}
        </button>
      </div>
    </form>
  );
};

// ─── Página principal ─────────────────────────────────────────────────────────

export const AdminUsuarias = () => {
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';

  const [busqueda, setBusqueda] = useState('');
  const [selPaciente, setSelPaciente] = useState(() => {
    return localStorage.getItem('selected_gestante_gmi') || 'XYZ1002';
  });

  useEffect(() => {
    if (selPaciente && selPaciente !== 'XYZ1002') {
      localStorage.setItem('selected_gestante_gmi', selPaciente);
    }
  }, [selPaciente]);
  const [activeList, setActiveList] = useState<'maternas' | 'staff'>('maternas');

  // --- Estados de Fórmula Obstétrica ---
  const [formula, setFormula] = useState<IObstetricFormula | null>(null);
  const [editingFormula, setEditingFormula] = useState(false);
  const [formulaForm, setFormulaForm] = useState<IObstetricFormula>({
    gestaciones: 0,
    partos: 0,
    cesareas: 0,
    abortos: 0,
    vivos: 0,
    mortinatos: 0
  });

  // --- Estados de Antecedentes Patológicos ---
  const [antecedentes, setAntecedentes] = useState<IPathologicalHistory[]>([]);
  const [loadingClinico, setLoadingClinico] = useState(false);
  const [editingAntecedenteId, setEditingAntecedenteId] = useState<string | null>(null);
  const [antecedenteForm, setAntecedenteForm] = useState({
    tipo_condicion: '',
    descripcion: '',
    fecha_diagnostico: '',
    controlada: true,
    tratamiento_actual: ''
  });

  // --- Efecto para Cargar Datos Clínicos ---
  useEffect(() => {
    if (activeList === 'maternas' && selPaciente && selPaciente !== 'XYZ1002') {
      const fetchClinicalData = async () => {
        setLoadingClinico(true);
        try {
          const [formulaData, antecedentesData] = await Promise.all([
            getObstetricFormula(),
            getPathologicalHistory()
          ]);
          setFormula(formulaData);
          setAntecedentes(antecedentesData);
        } catch (error) {
          console.error("Error fetching clinical patient details:", error);
          setFormula(null);
          setAntecedentes([]);
        } finally {
          setLoadingClinico(false);
        }
      };
      fetchClinicalData();
    }
  }, [selPaciente, activeList]);

  // --- Handlers de Acciones ---
  const handleSaveFormula = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateObstetricFormula(formulaForm);
      setFormula(updated);
      setEditingFormula(false);
    } catch (error: any) {
      alert(error.response?.data?.detail || "Error al actualizar la fórmula obstétrica");
    }
  };

  const handleSaveAntecedente = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAntecedenteId === 'new') {
        const nuevo = await createPathologicalHistory({
          tipo_condicion: antecedenteForm.tipo_condicion,
          descripcion: antecedenteForm.descripcion || null,
          fecha_diagnostico: antecedenteForm.fecha_diagnostico || null,
          controlada: antecedenteForm.controlada,
          tratamiento_actual: antecedenteForm.tratamiento_actual || null
        });
        setAntecedentes(prev => [...prev, nuevo]);
      } else if (editingAntecedenteId) {
        const modificado = await updatePathologicalHistory(editingAntecedenteId, {
          tipo_condicion: antecedenteForm.tipo_condicion,
          descripcion: antecedenteForm.descripcion || null,
          fecha_diagnostico: antecedenteForm.fecha_diagnostico || null,
          controlada: antecedenteForm.controlada,
          tratamiento_actual: antecedenteForm.tratamiento_actual || null
        });
        setAntecedentes(prev => prev.map(a => a.id === editingAntecedenteId ? modificado : a));
      }
      setEditingAntecedenteId(null);
    } catch (error: any) {
      alert(error.response?.data?.detail || "Error al guardar el antecedente patológico");
    }
  };

  const handleDeleteAntecedente = async (id: string) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este antecedente patológico?")) return;
    try {
      await deletePathologicalHistory(id);
      setAntecedentes(prev => prev.filter(a => a.id !== id));
    } catch (error: any) {
      alert(error.response?.data?.detail || "Error al eliminar el antecedente");
    }
  };

  // Controla qué modal está abierto: 'gestante' | 'staff' | null
  const [modalOpen, setModalOpen] = useState<'gestante' | 'staff' | null>(null);

  // ── Panel médico (exámenes, alertas, cuestionario, emergencia) ──
  const [exams, setExams] = useState<ExamenResponse[]>([]);
  const [alarmSigns, setAlarmSigns] = useState<AlertaAdminResponse[]>([]);
  const [dailyHistory, setDailyHistory] = useState<RespuestaConPreguntaResponse[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamenResponse | null>(null);
  const [showAlertas, setShowAlertas] = useState(false);
  const [showCuestionario, setShowCuestionario] = useState(false);
  const [showEmergencia, setShowEmergencia] = useState(false);
  const [emergenciaForm, setEmergenciaForm] = useState<LlamadaEmergenciaCreate>({ motivo: '', destino: '', resultado: '' });
  const [emergenciaLoading, setEmergenciaLoading] = useState(false);
  const [emergenciaError, setEmergenciaError] = useState<string | null>(null);
  const [emergenciaSuccess, setEmergenciaSuccess] = useState(false);
  const [staffUsers, setStaffUsers] = useState<any[]>([]);
  const [selStaff, setSelStaff] = useState<any>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [isEditingStaff, setIsEditingStaff] = useState(false);
  const [editForm, setEditForm] = useState({ nombre: '', rol_id: 0 });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);

  useEffect(() => {
    getRoles().then(setRoles).catch(() => {
      setRoles([
        { id: 1, nombre: 'admin' },
        { id: 2, nombre: 'gestante' },
        { id: 3, nombre: 'clinico' },
        { id: 4, nombre: 'hospital' },
      ]);
    });
  }, []);

  const getRolNombre = (rol_id: number | string): string => {
    if (!roles || roles.length === 0) return 'Cargando...';
    const rol = roles.find(r => String(r.id) === String(rol_id));
    if (!rol) return `Rol ${rol_id}`;
    return rol.nombre.charAt(0).toUpperCase() + rol.nombre.slice(1);
  };

  useEffect(() => {
    setStatusError(null);
    setIsEditingStaff(false);
    setEditError(null);
    setEditSuccess(false);
    if (selStaff) {
      setEditForm({ nombre: selStaff.nombre || '', rol_id: Number(selStaff.rol_id) });
    }
  }, [selStaff]);

  const [gestantes, setGestantes] = useState<GestanteResponse[]>([]);

  useEffect(() => {
    if (activeList === 'maternas') {
      getGestantes().then(data => {
        setGestantes(data);
        if (data.length > 0 && selPaciente === 'XYZ1002') {
          setSelPaciente(data[0].codigo_gmi);
        }
      }).catch(console.error);
    } else if (activeList === 'staff' && isAdmin) {
      getStaffUsers().then(data => {
        setStaffUsers(data);
      }).catch(console.error);
    }
  }, [activeList, isAdmin]);

  const filtrados = gestantes.filter(p =>
    (p.codigo_gmi || p.id).toLowerCase().includes(busqueda.toLowerCase())
  );

  const gestanteSeleccionada = gestantes.find(g => g.codigo_gmi === selPaciente);

  useEffect(() => {
    if (!gestanteSeleccionada?.id) {
      setExams([]);
      setAlarmSigns([]);
      setDailyHistory([]);
      return;
    }
    const gestanteId = gestanteSeleccionada.id;
    setSelectedExam(null);
    getGestanteExams(gestanteId).then(setExams).catch(() => setExams([]));
    getGestanteAlarmSigns(gestanteId).then(setAlarmSigns).catch(() => setAlarmSigns([]));
    getGestanteDailyQuestionsHistory(gestanteId).then(setDailyHistory).catch(() => setDailyHistory([]));
  }, [gestanteSeleccionada?.id]);

  const abrirEmergencia = () => {
    setEmergenciaForm({ motivo: '', destino: '', resultado: '' });
    setEmergenciaError(null);
    setEmergenciaSuccess(false);
    setShowEmergencia(true);
  };

  const enviarEmergencia = async () => {
    if (!gestanteSeleccionada?.id) return;
    setEmergenciaLoading(true);
    setEmergenciaError(null);
    try {
      await createGestanteEmergencyCall(gestanteSeleccionada.id, emergenciaForm);
      setEmergenciaSuccess(true);
      setTimeout(() => setShowEmergencia(false), 1500);
    } catch (err: any) {
      const backendError = err.response?.data?.detail;
      setEmergenciaError(typeof backendError === 'string' ? backendError : 'No se pudo registrar la llamada de emergencia.');
    } finally {
      setEmergenciaLoading(false);
    }
  };

  const formatFecha = (iso?: string | null) => {
    if (!iso) return 'N/A';
    return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatRespuesta = (r: RespuestaConPreguntaResponse) => {
    if (r.respuesta_texto != null) return r.respuesta_texto;
    if (r.respuesta_booleana != null) return r.respuesta_booleana ? 'Sí' : 'No';
    if (r.respuesta_numerica != null) return String(r.respuesta_numerica);
    return 'Sin respuesta';
  };

  const staffFiltrados = staffUsers.filter(u =>
    (u.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className={styles.root}>

      {/*tabs*/}
      <HeaderActividad rol="medico" tabActivo="Usuarias" />

      {/* ── MAIN GRID ── */}
      <div className={styles.grid}>

        {/*parte izquierda ls lista*/}
        <div className={styles.panel}>
          <div style={{ marginBottom: '16px' }}>
            <p className={styles.panelTitle} style={{ margin: 0 }}>Lista</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
            {isAdmin && (
              <button
                className={styles.addPacienteBtn}
                style={{ flex: 1 }}
                onClick={() => setModalOpen('gestante')}
              >
                + Materna
              </button>
            )}
            {isAdmin && (
              <button
                className={styles.addPacienteBtn}
                style={{ flex: 1, background: '#7C3AED' }}
                onClick={() => setModalOpen('staff')}
                title="Crear usuario de staff (clínico, admin, investigador)"
              >
                + Staff
              </button>
            )}
          </div>

          {isAdmin && (
            <div className={styles.tabContainer}>
              <button
                className={`${styles.tabBtn} ${activeList === 'maternas' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveList('maternas')}
              >
                Maternas
              </button>
              <button
                className={`${styles.tabBtn} ${activeList === 'staff' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveList('staff')}
              >
                Staff
              </button>
            </div>
          )}

          <div className={styles.searchWrap}>
            <input
              className={styles.searchInput}
              placeholder={activeList === 'maternas' ? "Buscar por codigo" : "Buscar por nombre o email"}
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
            <svg className={styles.searchIcon} width="14" height="14"
              viewBox="0 0 24 24" fill="none" stroke="#CA436E"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>

          <div className={styles.pList}>
            {activeList === 'maternas' ? (
              filtrados.map((p, i) => {
                const getTrimestre = (semanas?: number | null) => {
                  if (!semanas) return 'N/A';
                  if (semanas <= 13) return 'Trimestre 1';
                  if (semanas <= 27) return 'Trimestre 2';
                  return 'Trimestre 3';
                };
                return (
                <div
                  key={p.id || i}
                  className={`${styles.pItem} ${p.codigo_gmi === selPaciente ? styles.pItemSel : ''}`}
                  onClick={() => setSelPaciente(p.codigo_gmi)}
                >
                  <span className={styles.pId}>{p.codigo_gmi}</span>
                  <div>
                    <div className={styles.pDetail}>Nro Semana · {p.semanas_eg_ingreso || 0}</div>
                    <div className={styles.pDetail}>Fase · {getTrimestre(p.semanas_eg_ingreso)}</div>
                  </div>
                </div>
              )})
            ) : (
              staffFiltrados.map((u, i) => (
                <div
                  key={u.id || i}
                  className={`${styles.pItem} ${selStaff?.id === u.id ? styles.pItemSel : ''}`}
                  onClick={() => setSelStaff(u)}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '13px', color: '#333' }}>{u.nombre}</span>
                      <span style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        background: u.activo ? '#d1fae5' : '#fee2e2',
                        color: u.activo ? '#065f46' : '#991b1b'
                      }}>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{u.email}</span>
                    <span style={{
                      fontSize: '10px',
                      marginTop: '4px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      alignSelf: 'flex-start',
                      background: getRolNombre(u.rol_id).toLowerCase() === 'admin' ? '#fce8ef' : '#e0f2fe',
                      color: getRolNombre(u.rol_id).toLowerCase() === 'admin' ? '#CA436E' : '#0284c7'
                    }}>
                      {getRolNombre(u.rol_id)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/*parte central los detalles*/}
        {activeList === 'maternas' ? (
          <div className={`${styles.panel} ${styles.panelScroll}`}>
            <h1 className={styles.nombrePaciente}>{selPaciente}</h1>
            <p className={styles.diagnostico}>
              EMBARAZO DE ALTO RIESGO SIN OTRA ESPECIFICACION
            </p>

            <p className={styles.infoRow}><strong>Nro Semana</strong> · {gestanteSeleccionada?.semanas_eg_ingreso || 'N/A'}</p>
            <p className={styles.infoRow}><strong>Fecha posible parto</strong>  {gestanteSeleccionada?.fecha_probable_parto || 'N/A'}</p>
            <p className={styles.infoRow}><strong>Ultima menstruacion</strong>  {gestanteSeleccionada?.fecha_ultima_menstruacion || 'N/A'}</p>
            <p className={styles.infoRow}>
              <strong>Nivel de riesgo</strong>
              &nbsp;<span className={styles.sobrepeso}>{gestanteSeleccionada?.nivel_riesgo?.toUpperCase() || 'N/A'}</span>
            </p>

            <p className={styles.ipsText}>
              IPS DE ATENCION <strong>Ese hospital de Puerto Colombia</strong>
            </p>
            <button className={styles.emergenciaBtn} onClick={abrirEmergencia}>
              Generar llamada de emergencia
            </button>

            {/* --- FÓRMULA OBSTÉTRICA --- */}
            <div className={styles.formulaContainer}>
              <div className={styles.formulaHeader}>
                <h3>Fórmula Obstétrica</h3>
                {!editingFormula && (
                  <button 
                    className={styles.editBtn}
                    onClick={() => {
                      setFormulaForm(formula || { gestaciones: 0, partos: 0, cesareas: 0, abortos: 0, vivos: 0, mortinatos: 0 });
                      setEditingFormula(true);
                    }}
                  >
                    ✏️ Editar
                  </button>
                )}
              </div>

              {editingFormula ? (
                <form onSubmit={handleSaveFormula} className={styles.inlineForm}>
                  <div className={styles.formGrid}>
                    <div className={styles.formField}>
                      <label>Gestaciones (G)</label>
                      <input 
                        type="number" min="0" required
                        value={formulaForm.gestaciones}
                        onChange={e => setFormulaForm({...formulaForm, gestaciones: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className={styles.formField}>
                      <label>Partos (P)</label>
                      <input 
                        type="number" min="0" required
                        value={formulaForm.partos}
                        onChange={e => setFormulaForm({...formulaForm, partos: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className={styles.formField}>
                      <label>Cesáreas (C)</label>
                      <input 
                        type="number" min="0" required
                        value={formulaForm.cesareas}
                        onChange={e => setFormulaForm({...formulaForm, cesareas: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className={styles.formField}>
                      <label>Abortos (A)</label>
                      <input 
                        type="number" min="0" required
                        value={formulaForm.abortos}
                        onChange={e => setFormulaForm({...formulaForm, abortos: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className={styles.formField}>
                      <label>Vivos (V)</label>
                      <input 
                        type="number" min="0" required
                        value={formulaForm.vivos}
                        onChange={e => setFormulaForm({...formulaForm, vivos: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className={styles.formField}>
                      <label>Mortinatos (M)</label>
                      <input 
                        type="number" min="0" required
                        value={formulaForm.mortinatos}
                        onChange={e => setFormulaForm({...formulaForm, mortinatos: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <div className={styles.formActions}>
                    <button type="button" className={styles.btnCancel} onClick={() => setEditingFormula(false)}>Cancelar</button>
                    <button type="submit" className={styles.btnSave}>Guardar</button>
                  </div>
                </form>
              ) : (
                <div className={styles.formulaGrid}>
                  <div className={styles.formulaItem}>
                    <span className={styles.formulaCount}>{formula?.gestaciones ?? 0}</span>
                    <span className={styles.formulaLabel}>G</span>
                  </div>
                  <div className={styles.formulaItem}>
                    <span className={styles.formulaCount}>{formula?.partos ?? 0}</span>
                    <span className={styles.formulaLabel}>P</span>
                  </div>
                  <div className={styles.formulaItem}>
                    <span className={styles.formulaCount}>{formula?.cesareas ?? 0}</span>
                    <span className={styles.formulaLabel}>C</span>
                  </div>
                  <div className={styles.formulaItem}>
                    <span className={styles.formulaCount}>{formula?.abortos ?? 0}</span>
                    <span className={styles.formulaLabel}>A</span>
                  </div>
                  <div className={styles.formulaItem}>
                    <span className={styles.formulaCount}>{formula?.vivos ?? 0}</span>
                    <span className={styles.formulaLabel}>V</span>
                  </div>
                  <div className={styles.formulaItem}>
                    <span className={styles.formulaCount}>{formula?.mortinatos ?? 0}</span>
                    <span className={styles.formulaLabel}>M</span>
                  </div>
                </div>
              )}
            </div>

            {/* --- ANTECEDENTES PATOLÓGICOS --- */}
            <div className={styles.antecedentesContainer}>
              <div className={styles.antecedentesHeader}>
                <h3>Antecedentes Patológicos</h3>
                {!editingAntecedenteId && (
                  <button 
                    className={styles.editBtn}
                    onClick={() => {
                      setAntecedenteForm({
                        tipo_condicion: '',
                        descripcion: '',
                        fecha_diagnostico: new Date().toISOString().split('T')[0],
                        controlada: true,
                        tratamiento_actual: ''
                      });
                      setEditingAntecedenteId('new');
                    }}
                  >
                    ➕ Agregar
                  </button>
                )}
              </div>

              {editingAntecedenteId ? (
                <form onSubmit={handleSaveAntecedente} className={styles.inlineForm}>
                  <div className={styles.formGrid}>
                    <div className={`${styles.formField} ${styles.formFieldFull}`}>
                      <label>Tipo de Condición *</label>
                      <input 
                        type="text" required placeholder="Ej. Diabetes Gestacional, Hipertensión"
                        value={antecedenteForm.tipo_condicion}
                        onChange={e => setAntecedenteForm({...antecedenteForm, tipo_condicion: e.target.value})}
                      />
                    </div>
                    <div className={`${styles.formField} ${styles.formFieldFull}`}>
                      <label>Descripción</label>
                      <textarea 
                        placeholder="Detalles sobre el diagnóstico..."
                        value={antecedenteForm.descripcion}
                        onChange={e => setAntecedenteForm({...antecedenteForm, descripcion: e.target.value})}
                      />
                    </div>
                    <div className={styles.formField}>
                      <label>Fecha de Diagnóstico</label>
                      <input 
                        type="date"
                        value={antecedenteForm.fecha_diagnostico}
                        onChange={e => setAntecedenteForm({...antecedenteForm, fecha_diagnostico: e.target.value})}
                      />
                    </div>
                    <div className={styles.formField}>
                      <label>Estado de Control</label>
                      <select 
                        value={antecedenteForm.controlada ? 'true' : 'false'}
                        onChange={e => setAntecedenteForm({...antecedenteForm, controlada: e.target.value === 'true'})}
                      >
                        <option value="true">Controlada</option>
                        <option value="false">No controlada</option>
                      </select>
                    </div>
                    <div className={`${styles.formField} ${styles.formFieldFull}`}>
                      <label>Tratamiento Actual</label>
                      <input 
                        type="text" placeholder="Ej. Insulina, Dieta, Medicamentos..."
                        value={antecedenteForm.tratamiento_actual}
                        onChange={e => setAntecedenteForm({...antecedenteForm, tratamiento_actual: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className={styles.formActions}>
                    <button type="button" className={styles.btnCancel} onClick={() => setEditingAntecedenteId(null)}>Cancelar</button>
                    <button type="submit" className={styles.btnSave}>Guardar</button>
                  </div>
                </form>
              ) : (
                <div className={styles.antecedentesList}>
                  {loadingClinico ? (
                    <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>Cargando datos clínicos...</p>
                  ) : antecedentes.length === 0 ? (
                    <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>No hay antecedentes registrados.</p>
                  ) : (
                    antecedentes.map(ant => (
                      <div key={ant.id} className={styles.antecedenteCard}>
                        <div className={styles.antecedenteTitleRow}>
                          <h4 className={styles.antecedenteTitle}>{ant.tipo_condicion}</h4>
                          <div className={styles.antecedenteBadges}>
                            <span className={`${styles.badge} ${ant.controlada ? styles.badgeControlled : styles.badgeNotControlled}`}>
                              {ant.controlada ? 'Controlada' : 'No controlada'}
                            </span>
                          </div>
                        </div>
                        {ant.descripcion && <p className={styles.antecedenteDesc}>{ant.descripcion}</p>}
                        
                        <div className={styles.antecedenteMeta}>
                          {ant.fecha_diagnostico && <span>📅 Diagnóstico: {ant.fecha_diagnostico}</span>}
                          {ant.tratamiento_actual && <span>💊 Tratamiento: {ant.tratamiento_actual}</span>}
                        </div>

                        <div className={styles.antecedenteActions}>
                          <button 
                            type="button"
                            className={styles.actionIconBtn} 
                            title="Editar"
                            onClick={() => {
                              setAntecedenteForm({
                                tipo_condicion: ant.tipo_condicion,
                                descripcion: ant.descripcion || '',
                                fecha_diagnostico: ant.fecha_diagnostico || '',
                                controlada: !!ant.controlada,
                                tratamiento_actual: ant.tratamiento_actual || ''
                              });
                              setEditingAntecedenteId(ant.id);
                            }}
                          >
                            ✏️
                          </button>
                          <button 
                            type="button"
                            className={styles.actionIconBtn} 
                            title="Eliminar"
                            onClick={() => handleDeleteAntecedente(ant.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <h2 className={styles.secTitle}>Análisis actual de la paciente</h2>
            <p className={styles.secDesc}>
              Para agregar un nuevo análisis dar click en el símbolo agregar
              en la parte superior derecha del siguiente recuadro.
              Dar click en el análisis para ver detalle o editar.
            </p>

            <div className={styles.analisisBox}>
              <button className={styles.addBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="#CA436E" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </button>
              {exams.length === 0 ? (
                <p className={styles.secDesc} style={{ margin: 0 }}>
                  Sin análisis registrados para esta paciente.
                </p>
              ) : (
                <div className={styles.analisisGrid}>
                  {exams.map((e) => (
                    <button
                      key={e.id}
                      className={`${styles.analisisBtn} ${selectedExam?.id === e.id ? styles.analisisBtnOn : ''}`}
                      onClick={() => setSelectedExam(e)}
                    >
                      {(e.tipo_examen_nombre || `Examen #${e.tipo_examen_id}`).toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`${styles.panel} ${styles.panelScroll}`}>
            {selStaff ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h1 className={styles.nombrePaciente}>{selStaff.nombre}</h1>
                    <p className={styles.diagnostico}>
                      {getRolNombre(selStaff.rol_id).toLowerCase() === 'admin' ? 'Administrador' : 
                       getRolNombre(selStaff.rol_id).toLowerCase() === 'hospital' ? 'Personal Hospitalario' : 
                       'Personal Clínico'}
                    </p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => setIsEditingStaff(!isEditingStaff)}
                      style={{
                        padding: '6px 12px', borderRadius: '20px', border: '1px solid #CA436E',
                        background: isEditingStaff ? '#CA436E' : 'transparent',
                        color: isEditingStaff ? 'white' : '#CA436E', cursor: 'pointer', fontSize: '12px'
                      }}
                    >
                      {isEditingStaff ? 'Cancelar' : 'Editar'}
                    </button>
                  )}
                </div>

                {isEditingStaff && isAdmin ? (
                  <form
                    style={{ marginTop: '20px', padding: '16px', background: '#f9f9f9', borderRadius: '12px', border: '1px solid #eee' }}
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setEditLoading(true);
                      setEditError(null);
                      setEditSuccess(false);
                      try {
                        await updateStaffUser(selStaff.id, editForm);
                        setEditSuccess(true);
                        const updatedUsers = await getStaffUsers();
                        setStaffUsers(updatedUsers);
                        const updatedSel = updatedUsers.find((u: any) => u.id === selStaff.id);
                        if (updatedSel) setSelStaff(updatedSel);
                        setTimeout(() => setIsEditingStaff(false), 1500);
                      } catch (err: any) {
                        setEditError(err.response?.data?.detail || 'Error al actualizar el usuario');
                      } finally {
                        setEditLoading(false);
                      }
                    }}
                  >
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#333' }}>Editar Usuario</h3>

                    {editSuccess && (
                      <div style={{ padding: '10px', background: '#d1fae5', color: '#065f46', borderRadius: '6px', marginBottom: '15px', fontSize: '13px' }}>
                        ✅ Usuario actualizado
                      </div>
                    )}
                    {editError && (
                      <div style={{ padding: '10px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '15px', fontSize: '13px' }}>
                        ❌ {typeof editError === 'string' ? editError : 'Error'}
                      </div>
                    )}

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '4px' }}>Nombre completo</label>
                      <input
                        type="text"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                        value={editForm.nombre}
                        onChange={(e) => setEditForm(prev => ({ ...prev, nombre: e.target.value }))}
                        disabled={editLoading}
                        required
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '4px' }}>Rol</label>
                      <select
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                        value={editForm.rol_id}
                        onChange={(e) => setEditForm(prev => ({ ...prev, rol_id: Number(e.target.value) }))}
                        disabled={editLoading}
                      >
                        {roles.map(r => (
                          <option key={r.id} value={r.id}>
                            {r.nombre.charAt(0).toUpperCase() + r.nombre.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={editLoading}
                      style={{
                        background: '#CA436E', color: 'white', border: 'none', padding: '8px 16px',
                        borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, width: '100%'
                      }}
                    >
                      {editLoading ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </form>
                ) : (
                  <div style={{ marginTop: '20px' }}>
                    <p className={styles.infoRow}><strong>Email:</strong> {selStaff.email}</p>
                    <p className={styles.infoRow}><strong>Fecha de creación:</strong> {selStaff.created_at ? new Date(selStaff.created_at).toLocaleDateString() : 'N/A'}</p>
                  </div>
                )}

                <div style={{ marginTop: '30px', padding: '16px', background: '#f9f9f9', borderRadius: '12px', border: '1px solid #eee' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>Estado del Usuario</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '13px', color: '#555' }}>
                      El usuario actualmente está <strong>{selStaff.activo ? 'Activo' : 'Inactivo'}</strong>.
                    </span>
                    <button
                      onClick={async () => {
                        try {
                          setStatusError(null);
                          const updated = await updateStaffStatus(selStaff.id, !selStaff.activo);
                          setStaffUsers(prev => prev.map(u => u.id === selStaff.id ? { ...u, activo: updated.activo ?? !u.activo } : u));
                          setSelStaff((prev: any) => ({ ...prev, activo: updated.activo ?? !prev.activo }));
                        } catch (err: any) {
                          const errorMsg = err.response?.data?.detail || 'Error al actualizar el estado';
                          setStatusError(typeof errorMsg === 'string' ? errorMsg : 'Error al actualizar el estado');
                        }
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        background: selStaff.activo ? '#fee2e2' : '#d1fae5',
                        color: selStaff.activo ? '#991b1b' : '#065f46',
                        marginLeft: 'auto'
                      }}
                    >
                      {selStaff.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                  {statusError && <p style={{ color: '#dc2626', fontSize: '12px', margin: '10px 0 0 0' }}>{statusError}</p>}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999', fontSize: '14px' }}>
                Seleccione un usuario de staff para ver sus detalles
              </div>
            )}
          </div>
        )}

        {/*reporte diario en panel derecho*/}
        {activeList === 'maternas' ? (
          <div className={`${styles.panel} ${styles.reportePanel}`}>
            <h2 className={styles.panelTitle}>Reporte diario</h2>
            <p className={styles.secDesc}>
              En el siguiente recuadro aparecerán los reportes diario
              que de la paciente, dar click a cada uno para ver el detalle
            </p>

            <button className={styles.alertaBtn} onClick={() => setShowAlertas(true)}>
              Signos de alerta ⚠️ {alarmSigns.length > 0 ? `(${alarmSigns.length})` : ''}
            </button>
            <button className={styles.cuestionarioBtn} onClick={() => setShowCuestionario(true)}>
              Revisar cuestionario diario
            </button>

            <div className={styles.reporteCards}>
              <div className={styles.rcard} style={{ width: '75%', background: '#f9c0cf' }} />
              <div className={styles.rcard} style={{ width: '65%', background: '#f9c0cf' }} />
              <div className={styles.rcard} style={{ width: '50%', background: '#e8e8e8', marginLeft: 'auto' }} />
              <div className={styles.rcard} style={{ width: '40%', background: '#f9c0cf' }} />
              <div className={styles.rcard} style={{ width: '55%', background: '#e8e8e8', marginLeft: 'auto' }} />
            </div>

            <input className={styles.reporteInput} placeholder="Click para escribir" />
          </div>
        ) : (
          <div className={styles.panel} style={{ background: 'transparent', boxShadow: 'none' }}></div>
        )}

      </div>

      {/* Modal: registrar nueva materna */}
      <Modal
        isOpen={modalOpen === 'gestante'}
        onClose={() => setModalOpen(null)}
        title="Registrar Nueva Materna"
      >
        <FormRegister />
      </Modal>

      {/* Modal: crear usuario staff */}
      <Modal
        isOpen={modalOpen === 'staff'}
        onClose={() => setModalOpen(null)}
        title="Crear Usuario de Staff"
      >
        <StaffCreateModal onClose={() => setModalOpen(null)} />
      </Modal>

      {/* Modal: detalle de examen/análisis */}
      <Modal
        isOpen={!!selectedExam}
        onClose={() => setSelectedExam(null)}
        title={selectedExam?.tipo_examen_nombre?.toUpperCase() || 'Detalle del Análisis'}
      >
        {selectedExam && (
          <div className={modalStyles.form}>
            <p className={styles.infoRow}><strong>Fecha de toma</strong> · {formatFecha(selectedExam.fecha_toma)}</p>
            <p className={styles.infoRow}><strong>Resultado</strong> · {selectedExam.resultado}</p>
            {selectedExam.resultado_numerico != null && (
              <p className={styles.infoRow}>
                <strong>Valor</strong> · {selectedExam.resultado_numerico} {selectedExam.unidad || ''}
              </p>
            )}
            {selectedExam.semana_gestacion != null && (
              <p className={styles.infoRow}><strong>Semana de gestación</strong> · {selectedExam.semana_gestacion}</p>
            )}
            {selectedExam.trimestre != null && (
              <p className={styles.infoRow}><strong>Trimestre</strong> · {selectedExam.trimestre}</p>
            )}
            {selectedExam.observaciones && (
              <p className={styles.infoRow}><strong>Observaciones</strong> · {selectedExam.observaciones}</p>
            )}
            <p className={styles.infoRow}><strong>Registrado</strong> · {formatFecha(selectedExam.created_at)}</p>
          </div>
        )}
      </Modal>

      {/* Modal: signos de alerta */}
      <Modal
        isOpen={showAlertas}
        onClose={() => setShowAlertas(false)}
        title="Signos de Alerta"
      >
        <div className={modalStyles.form}>
          {alarmSigns.length === 0 ? (
            <p className={styles.secDesc} style={{ margin: 0 }}>
              No hay signos de alerta activos para esta paciente.
            </p>
          ) : (
            alarmSigns.map((a) => (
              <div key={a.id} style={{ padding: '12px', background: '#fdeded', borderRadius: '12px', border: '1px solid #f9c0cf' }}>
                <p className={styles.infoRow} style={{ margin: 0 }}><strong>{a.descripcion || 'Sin descripción'}</strong></p>
                <p className={styles.infoRow}><strong>Estado</strong> · {a.estado}</p>
                {a.tipo_alerta && <p className={styles.infoRow}><strong>Tipo</strong> · {a.tipo_alerta}</p>}
                {a.prioridad && <p className={styles.infoRow}><strong>Prioridad</strong> · {a.prioridad}</p>}
                {a.modulo_origen && <p className={styles.infoRow}><strong>Módulo</strong> · {a.modulo_origen}</p>}
                <p className={styles.infoRow}><strong>Fecha</strong> · {formatFecha(a.created_at)}</p>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Modal: historial de cuestionario diario */}
      <Modal
        isOpen={showCuestionario}
        onClose={() => setShowCuestionario(false)}
        title="Cuestionario Diario"
      >
        <div className={modalStyles.form}>
          {dailyHistory.length === 0 ? (
            <p className={styles.secDesc} style={{ margin: 0 }}>
              No hay respuestas registradas para esta paciente.
            </p>
          ) : (
            dailyHistory.map((r) => (
              <div key={r.id} style={{ padding: '12px', background: '#f9f9f9', borderRadius: '12px', border: '1px solid #eee' }}>
                <p className={styles.infoRow} style={{ margin: 0 }}><strong>{r.pregunta_texto}</strong></p>
                <p className={styles.infoRow}><strong>Respuesta</strong> · {formatRespuesta(r)}</p>
                {r.semana_gestacion != null && (
                  <p className={styles.infoRow}><strong>Semana</strong> · {r.semana_gestacion}</p>
                )}
                <p className={styles.infoRow}><strong>Fecha</strong> · {formatFecha(r.created_at)}</p>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Modal: generar llamada de emergencia */}
      <Modal
        isOpen={showEmergencia}
        onClose={() => setShowEmergencia(false)}
        title="Generar Llamada de Emergencia"
      >
        <div className={modalStyles.form}>
          {emergenciaSuccess && (
            <div className={modalStyles.successBanner}>
              ✅ Llamada de emergencia registrada
            </div>
          )}

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Motivo</label>
            <input
              className={modalStyles.input}
              type="text"
              placeholder="Ej. Sangrado abundante"
              value={emergenciaForm.motivo || ''}
              onChange={(e) => setEmergenciaForm(prev => ({ ...prev, motivo: e.target.value }))}
              disabled={emergenciaLoading}
            />
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Destino</label>
            <input
              className={modalStyles.input}
              type="text"
              placeholder="Ej. Hospital de Puerto Colombia"
              value={emergenciaForm.destino || ''}
              onChange={(e) => setEmergenciaForm(prev => ({ ...prev, destino: e.target.value }))}
              disabled={emergenciaLoading}
            />
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Resultado</label>
            <input
              className={modalStyles.input}
              type="text"
              placeholder="Ej. Atendida, en camino..."
              value={emergenciaForm.resultado || ''}
              onChange={(e) => setEmergenciaForm(prev => ({ ...prev, resultado: e.target.value }))}
              disabled={emergenciaLoading}
            />
          </div>

          {emergenciaError && (
            <p className={modalStyles.error}>{emergenciaError}</p>
          )}

          <div className={modalStyles.actions}>
            <button
              type="button"
              className={modalStyles.cancelBtn}
              onClick={() => setShowEmergencia(false)}
              disabled={emergenciaLoading}
            >
              Cancelar
            </button>
            <button
              type="button"
              className={modalStyles.submitBtn}
              onClick={enviarEmergencia}
              disabled={emergenciaLoading}
            >
              {emergenciaLoading ? 'Enviando...' : 'Generar llamada'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};