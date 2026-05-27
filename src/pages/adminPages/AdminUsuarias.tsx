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
  type RoleOption,
} from '../../services/adminService';

interface Paciente {
  id: string;
  semana: number;
  fase: string;
}

const PACIENTES: Paciente[] = [
  { id: 'WSC2001', semana: 3, fase: 'Trimestre 1' },
  { id: 'XYZ1002', semana: 2, fase: 'Trimestre 1' },
  { id: 'WSX2032', semana: 14, fase: 'Trimestre 2' },
  { id: 'XSX2362', semana: 20, fase: 'Trimestre 2' },
  { id: 'JSX0937', semana: 36, fase: 'Trimestre 3' },
  { id: 'WSX2033', semana: 14, fase: 'Trimestre 2' },
  { id: 'XSX2363', semana: 20, fase: 'Trimestre 2' },
  { id: 'WSX2034', semana: 14, fase: 'Trimestre 2' },
  { id: 'WSX2035', semana: 14, fase: 'Trimestre 2' },
  { id: 'XSX2364', semana: 20, fase: 'Trimestre 2' },
  { id: 'JSX0938', semana: 36, fase: 'Trimestre 3' },
  { id: 'WSC2002', semana: 3, fase: 'Trimestre 1' },
];

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
        // Excluir el rol "gestante" (id=1) del selector de staff
        setRoles(data.filter((r) => r.id !== 1));
      })
      .catch(() => {
        // Fallback con roles estáticos si el backend no responde
        setRoles([
          { id: 2, nombre: 'clinico' },
          { id: 3, nombre: 'admin' },
          { id: 5, nombre: 'investigador' },
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

  useEffect(() => {
    setStatusError(null);
  }, [selStaff]);

  useEffect(() => {
    if (activeList === 'staff' && isAdmin) {
      getStaffUsers().then(data => {
        setStaffUsers(data);
      }).catch(console.error);
    }
  }, [activeList, isAdmin]);

  const filtrados = PACIENTES.filter(p =>
    p.id.toLowerCase().includes(busqueda.toLowerCase())
  );

  const staffFiltrados = staffUsers.filter(u => 
    (u.nombre || u.nombres || '').toLowerCase().includes(busqueda.toLowerCase()) ||
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <p className={styles.panelTitle} style={{ margin: 0 }}>Lista</p>
            <div style={{ display: 'flex', gap: '6px' }}>
              {isAdmin && (
                <button
                  className={styles.addPacienteBtn}
                  onClick={() => setModalOpen('gestante')}
                >
                  + Materna
                </button>
              )}
              {isAdmin && (
                <button
                  className={styles.addPacienteBtn}
                  style={{ background: '#7C3AED' }}
                  onClick={() => setModalOpen('staff')}
                  title="Crear usuario de staff (clínico, admin, investigador)"
                >
                  + Staff
                </button>
              )}
            </div>
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
              filtrados.map((p, i) => (
                <div
                  key={i}
                  className={`${styles.pItem} ${p.id === selPaciente ? styles.pItemSel : ''}`}
                  onClick={() => setSelPaciente(p.id)}
                >
                  <span className={styles.pId}>{p.id}</span>
                  <div>
                    <div className={styles.pDetail}>Nro Semana · {p.semana}</div>
                    <div className={styles.pDetail}>Fase · {p.fase}</div>
                  </div>
                </div>
              ))
            ) : (
              staffFiltrados.map((u, i) => (
                <div
                  key={u.id || i}
                  className={`${styles.pItem} ${selStaff?.id === u.id ? styles.pItemSel : ''}`}
                  onClick={() => setSelStaff(u)}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '13px', color: '#333' }}>{u.nombre || u.nombres}</span>
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
                      background: u.rol_id === 3 || u.rol_id === '3' ? '#fce8ef' : '#e0f2fe',
                      color: u.rol_id === 3 || u.rol_id === '3' ? '#CA436E' : '#0284c7'
                    }}>
                      {u.rol_id === 3 || u.rol_id === '3' ? 'Admin' : 'Clínico'}
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

          <p className={styles.infoRow}><strong>Nro Semana</strong> · 2</p>
          <p className={styles.infoRow}><strong>Fecha posible parto</strong>  2025-12-10</p>
          <p className={styles.infoRow}><strong>Ultima menstruacion</strong>  2025-10-02</p>
          <p className={styles.infoRow}>
            <strong>Estado nutricional</strong>
            &nbsp;<span className={styles.sobrepeso}>SOBREPESO</span>
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
                <h1 className={styles.nombrePaciente}>{selStaff.nombre || selStaff.nombres}</h1>
                <p className={styles.diagnostico}>
                  {selStaff.rol_id === 3 || selStaff.rol_id === '3' ? 'Administrador' : 'Personal Clínico'}
                </p>
                
                <div style={{ marginTop: '20px' }}>
                  <p className={styles.infoRow}><strong>Email:</strong> {selStaff.email}</p>
                  <p className={styles.infoRow}><strong>Fecha de creación:</strong> {selStaff.created_at ? new Date(selStaff.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
                
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