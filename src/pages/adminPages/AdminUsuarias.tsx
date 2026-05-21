import { useState, useEffect } from 'react';
import { HeaderActividad } from '../../components/Headers/HeaderActividad/HeaderActividad';
import styles from '../../components/admin/AdminUsuarias.module.css';
import modalStyles from './StaffModal.module.css';
import { Modal } from '../../components/Modal';
import { FormRegister } from '../../components/info/contenteregister/FormRegister';
import {
  createStaffUser,
  getRoles,
  type StaffUserCreate,
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

const EMPTY_FORM: StaffUserCreate = {
  nombres: '',
  apellidos: '',
  email: '',
  password: '',
  rol_id: 2,
};

const StaffCreateModal = ({ onClose }: { onClose: () => void }) => {
  const [form, setForm] = useState<StaffUserCreate>(EMPTY_FORM);
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
    key: keyof StaffUserCreate,
    value: string | number | null
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombres.trim() || !form.email.trim() || !form.password.trim()) {
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
    } catch {
      setError('No se pudo crear el usuario. Verifica los datos e intenta de nuevo.');
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
          value={form.nombres}
          onChange={(e) => handleChange('nombres', e.target.value)}
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
  const [busqueda, setBusqueda] = useState('');
  const [selPaciente, setSelPaciente] = useState('XYZ1002');
  const [selAnalisis, setSelAnalisis] = useState('HEMOGLOBINA');

  // Controla qué modal está abierto: 'gestante' | 'staff' | null
  const [modalOpen, setModalOpen] = useState<'gestante' | 'staff' | null>(null);

  const filtrados = PACIENTES.filter(p =>
    p.id.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className={styles.root}>

      {/*tabs*/}
      <HeaderActividad rol="medico" tabActivo="Usuarias" />

      {/* ── MAIN GRID ── */}
      <div className={styles.grid}>

        {/*parte izquierda ls lista*/}
        <div className={styles.panel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className={styles.panelTitle}>Lista Maternas</p>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className={styles.addPacienteBtn}
                onClick={() => setModalOpen('gestante')}
              >
                + Materna
              </button>
              <button
                className={styles.addPacienteBtn}
                style={{ background: '#7C3AED' }}
                onClick={() => setModalOpen('staff')}
                title="Crear usuario de staff (clínico, admin, investigador)"
              >
                + Staff
              </button>
            </div>
          </div>

          <div className={styles.searchWrap}>
            <input
              className={styles.searchInput}
              placeholder="Buscar por codigo"
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
            {filtrados.map((p, i) => (
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
            ))}
          </div>
        </div>

        {/*parte central los detalles*/}
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

        {/*reporte diario en panel derecho*/}
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