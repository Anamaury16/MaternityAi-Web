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
  type GestanteResponse,
  type RoleOption,
} from '../../services/adminService';

const ANALISIS = [
  'HEMOGLOBINA', 'HEMATOCRITO',
  'PARCIAL ORINA', 'UROCULTIVO',
  'GLICEMA', 'CITOLOGÍA',
  'TOXO IgG', 'Ags HB',
  'Ags HB',
];

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
        // Solo mostrar Admin y Clínico en el selector de staff
        setRoles(data.filter((r) => r.nombre !== 'gestante' && r.nombre !== 'investigador'));
      })
      .catch(() => {
        // Fallback con roles estáticos si el backend no responde
        setRoles([
          { id: 2, nombre: 'clinico' },
          { id: 3, nombre: 'admin' },
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
  const [selPaciente, setSelPaciente] = useState('XYZ1002');
  const [selAnalisis, setSelAnalisis] = useState('HEMOGLOBINA');

  // Controla qué modal está abierto: 'gestante' | 'staff' | null
  const [modalOpen, setModalOpen] = useState<'gestante' | 'staff' | null>(null);

  const [activeList, setActiveList] = useState<'maternas' | 'staff'>('maternas');
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
            <button className={styles.emergenciaBtn}>
              Generar llamada de emergencia
            </button>

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
              <div className={styles.analisisGrid}>
                {ANALISIS.map((a, i) => (
                  <button
                    key={i}
                    className={`${styles.analisisBtn} ${selAnalisis === a ? styles.analisisBtnOn : ''}`}
                    onClick={() => setSelAnalisis(a)}
                  >
                    {a}
                  </button>
                ))}
              </div>
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
                      {getRolNombre(selStaff.rol_id).toLowerCase() === 'admin' ? 'Administrador' : 'Personal Clínico'}
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

            <button className={styles.alertaBtn}>Signos de alerta ⚠️</button>
            <button className={styles.cuestionarioBtn}>Revisar cuestionario diario</button>

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
    </div>
  );
};