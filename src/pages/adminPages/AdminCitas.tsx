import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../components/admin/AdminCitas.module.css';

interface Cita {
  id: number;
  hora: string;
  fecha: string;
  pacienteId: string;
  tipo: string;
  esHoy: boolean;
  dia: number;
}

interface Paciente {
  id: string;
  semana: number;
  fase: string;
}

const PACIENTES: Paciente[] = [
  { id: 'WSC2001', semana: 3,  fase: 'Trimestre 1' },
  { id: 'XYZ1002', semana: 2,  fase: 'Trimestre 1' },
  { id: 'WSX2032', semana: 14, fase: 'Trimestre 2' },
  { id: 'XSX2362', semana: 20, fase: 'Trimestre 2' },
  { id: 'JSX0937', semana: 36, fase: 'Trimestre 3' },
];

const CITAS: Cita[] = [
  { id: 1, hora: '09:00 AM', fecha: 'Hoy',    pacienteId: 'XYZ1002', tipo: 'Control Prenatal',      esHoy: true,  dia: 1  },
  { id: 2, hora: '11:30 AM', fecha: 'Hoy',    pacienteId: 'WSC2001', tipo: 'Ecografía Obstétrica',  esHoy: true,  dia: 8  },
  { id: 3, hora: '08:15 AM', fecha: '15 Oct', pacienteId: 'JSX0937', tipo: 'Monitoreo Fetal',        esHoy: false, dia: 15 },
  { id: 4, hora: '14:00 PM', fecha: '27 Oct', pacienteId: 'XSX2362', tipo: 'Consulta Nutricional',   esHoy: false, dia: 27 },
];

const DIAS_SEMANA = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

const SEMANAS = [
  [29, 30,  1,  2,  3,  4,  5],
  [ 6,  7,  8,  9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 31,  1,  2],
];

const TABS = ['Usuarias', 'OBA', 'Preguntas', 'Citas'] as const;

export const AdminCitas = () => {
  const navigate = useNavigate();
  const [selPaciente, setSelPaciente] = useState('XYZ1002');
  const [busqueda, setBusqueda]       = useState('');
  const [vista, setVista]             = useState<'Mes' | 'Semana'>('Mes');
  const [diaHoy]                      = useState(10);

  const handleTab = (tab: string) => {
    if (tab === 'Usuarias')  navigate('/admin/usuarias');
    if (tab === 'OBA')       navigate('/admin/oba');
    if (tab === 'Preguntas') navigate('/admin/preguntas');
  };

  const diasConCita = CITAS.map(c => c.dia);

  const filtrados = PACIENTES.filter(p =>
    p.id.toLowerCase().includes(busqueda.toLowerCase())
  );

  const esFueraDeMes = (semanaIdx: number, dia: number) => {
    if (semanaIdx === 0 && dia > 20) return true;
    if (semanaIdx === 4 && dia < 10) return true;
    return false;
  };

  return (
    <div className={styles.root}>

      {/* ── TOP NAV ── */}
      <div className={styles.topNav}>
        <div className={styles.tabs}>
          {TABS.map(t => (
            <button
              key={t}
              className={`${styles.tab} ${t === 'Citas' ? styles.tabOn : ''}`}
              onClick={() => handleTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* ── MAIN GRID ── */}
      <div className={styles.grid}>

        {/* ── PANEL IZQUIERDO: Lista ── */}
        <div className={styles.panel}>
          <p className={styles.panelTitle}>Lista Maternas</p>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="14" height="14"
              viewBox="0 0 24 24" fill="none" stroke="#999"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className={styles.searchInput}
              placeholder="Buscar por codigo"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
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

        {/* ── PANEL DERECHO: Calendario ── */}
        <div className={styles.panel}>

          {/* Header del panel */}
          <div className={styles.calPanelHeader}>
            <h2 className={styles.calTitulo}>Agendamiento de Citas</h2>
            <button className={styles.newCitaBtn}>+ Nueva Cita</button>
          </div>

          <div className={styles.calLayout}>
            {/* Calendario */}
            <div className={styles.calSection}>

              {/* Nav mes */}
              <div className={styles.calNav}>
                <div className={styles.calNavLeft}>
                  <button className={styles.navBtn}>‹</button>
                  <span className={styles.calMes}>Octubre 2025</span>
                  <button className={styles.navBtn}>›</button>
                </div>
                <div className={styles.vistaToggle}>
                  {(['Mes', 'Semana'] as const).map(v => (
                    <button
                      key={v}
                      className={`${styles.vistaBtn} ${vista === v ? styles.vistaBtnOn : ''}`}
                      onClick={() => setVista(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid del calendario */}
              <div className={styles.calGrid}>
                {/* Encabezado días */}
                <div className={styles.calDiasHeader}>
                  {DIAS_SEMANA.map(d => (
                    <div key={d} className={styles.calDiaLabel}>{d}</div>
                  ))}
                </div>

                {/* Semanas */}
                {SEMANAS.map((sem, si) => (
                  <div key={si} className={styles.calSemana}>
                    {sem.map((dia, di) => {
                      const fuera    = esFueraDeMes(si, dia);
                      const tieneCita = diasConCita.includes(dia) && !fuera;
                      const esHoy    = dia === diaHoy && !fuera;
                      return (
                        <div
                          key={di}
                          className={`
                            ${styles.calCell}
                            ${fuera    ? styles.calCellFuera : ''}
                            ${esHoy    ? styles.calCellHoy   : ''}
                            ${tieneCita && !fuera ? styles.calCellCita : ''}
                          `}
                        >
                          <span className={styles.calNum}>{dia}</span>
                          {tieneCita && <div className={styles.citaDot} />}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Próximas citas */}
            <div className={styles.proxSection}>
              <h3 className={styles.proxTitulo}>Próximas Citas</h3>
              <div className={styles.proxList}>
                {CITAS.map(c => (
                  <div key={c.id} className={styles.citaCard}>
                    <div className={styles.citaHoraRow}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="#CA436E" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        {c.esHoy
                          ? <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>
                          : <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>
                        }
                      </svg>
                      <span className={`${styles.citaHora} ${c.esHoy ? styles.citaHoy : ''}`}>
                        {c.hora} {c.esHoy ? '· Hoy' : `· ${c.fecha}`}
                      </span>
                    </div>
                    <p className={styles.citaPaciente}>Paciente: {c.pacienteId}</p>
                    <span className={styles.citaTipoBadge}>{c.tipo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};