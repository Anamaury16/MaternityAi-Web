import { useState } from 'react';
import { HeaderActividad } from '../../components/Headers/HeaderActividad/HeaderActividad';
import styles from '../../components/admin/AdminUsuarias.module.css';

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
  { id: 'WSX2033', semana: 14, fase: 'Trimestre 2' },
  { id: 'XSX2363', semana: 20, fase: 'Trimestre 2' },
  { id: 'WSX2034', semana: 14, fase: 'Trimestre 2' },
  { id: 'WSX2035', semana: 14, fase: 'Trimestre 2' },
  { id: 'XSX2364', semana: 20, fase: 'Trimestre 2' },
  { id: 'JSX0938', semana: 36, fase: 'Trimestre 3' },
  { id: 'WSC2002', semana: 3,  fase: 'Trimestre 1' },
];

const ANALISIS = [
  'HEMOGLOBINA', 'HEMATOCRITO',
  'PARCIAL ORINA', 'UROCULTIVO',
  'GLICEMA', 'CITOLOGÍA',
  'TOXO IgG', 'Ags HB',
  'Ags HB',
];

export const AdminUsuarias = () => {
  const [busqueda, setBusqueda]     = useState('');
  const [selPaciente, setSelPaciente] = useState('XYZ1002');
  const [selAnalisis, setSelAnalisis] = useState('HEMOGLOBINA');

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
          <p className={styles.panelTitle}>Lista Maternas</p>

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

        {/*parte dentral los detalles*/}
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
                <line x1="8"  y1="12" x2="16" y2="12" />
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
    </div>
  );
};