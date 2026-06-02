import { useState } from 'react';
import { HeaderActividad } from '../../components/Headers/HeaderActividad/HeaderActividad';
import styles from '../../components/admin/AdminPreguntas.module.css';

interface Pregunta {
  id: number;
  texto: string;
  categoria: string;
  prioridad: 'Alta' | 'Medio' | 'Baja';
  respuesta: string;
}

const PREGUNTAS_INIT: Pregunta[] = [
  { id: 1, texto: 'Cual es el protocolo a seguir para pacientes....?', categoria: 'Síntomas',     prioridad: 'Alta',  respuesta: '' },
  { id: 2, texto: 'Cual es el protocolo a seguir para pacientes....?', categoria: 'Síntomas',     prioridad: 'Medio', respuesta: '' },
  { id: 3, texto: 'Cual es el protocolo a seguir para pacientes....?', categoria: 'Síntomas',     prioridad: 'Alta',  respuesta: '' },
  { id: 4, texto: 'Cual es el protocolo a seguir para pacientes....?', categoria: 'Síntomas',     prioridad: 'Baja',  respuesta: '' },
  { id: 5, texto: 'Cual es el protocolo a seguir para pacientes....?', categoria: 'Controles',    prioridad: 'Baja',  respuesta: '' },
  { id: 6, texto: 'Cual es el protocolo a seguir para pacientes....?', categoria: 'Controles',    prioridad: 'Medio', respuesta: '' },
  { id: 7, texto: 'Cual es el protocolo a seguir para pacientes....?', categoria: 'Medicamentos', prioridad: 'Alta',  respuesta: '' },
  { id: 8, texto: 'Cual es el protocolo a seguir para pacientes....?', categoria: 'Medicamentos', prioridad: 'Baja',  respuesta: '' },
];

export const AdminPreguntas = () => {
  const [preguntas, setPreguntas] = useState<Pregunta[]>(PREGUNTAS_INIT);
  const [form, setForm] = useState({
    descripcion: '',
    prioridad: '',
    categoria: '',
    respuesta: '',
  });

  const guardar = () => {
    if (!form.descripcion || !form.prioridad || !form.categoria) return;
    const nueva: Pregunta = {
      id: preguntas.length + 1,
      texto: form.descripcion,
      categoria: form.categoria,
      prioridad: form.prioridad as 'Alta' | 'Medio' | 'Baja',
      respuesta: form.respuesta,
    };
    setPreguntas([...preguntas, nueva]);
    setForm({ descripcion: '', prioridad: '', categoria: '', respuesta: '' });
  };

  const eliminar = (id: number) => {
    setPreguntas(preguntas.filter(p => p.id !== id));
  };

  const colorPrioridad = (p: string): React.CSSProperties => {
    if (p === 'Alta')  return { background: '#e53935', color: 'white' };
    if (p === 'Medio') return { background: '#fb8c00', color: 'white' };
    return { background: '#43a047', color: 'white' };
  };

  const alta  = preguntas.filter(p => p.prioridad === 'Alta').length;
  const medio = preguntas.filter(p => p.prioridad === 'Medio').length;
  const baja  = preguntas.filter(p => p.prioridad === 'Baja').length;
  const cats  = [...new Set(preguntas.map(p => p.categoria))];

  return (
    <div className={styles.root}>

      {/*header con tabs*/}
      <HeaderActividad rol="medico" tabActivo="Preguntas" />

      {/*main grid*/}
      <div className={styles.grid}>

        {/*column izq*/}
        <div className={styles.leftCol}>

          {/* Formulario */}
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Formular Preguntas</h2>
            <p className={styles.secDesc}>Crea preguntas frecuentes para mejorar las respuestas del sistema.</p>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Descripción</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Escribe la descripción de la pregunta..."
                  value={form.descripcion}
                  onChange={e => setForm({ ...form, descripcion: e.target.value })}
                />
              </div>
              <div className={styles.formRightGroup}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Prioridad</label>
                  <select
                    className={styles.select}
                    value={form.prioridad}
                    onChange={e => setForm({ ...form, prioridad: e.target.value })}
                  >
                    <option value="">Seleccionar</option>
                    <option>Alta</option>
                    <option>Medio</option>
                    <option>Baja</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Categoría</label>
                  <select
                    className={styles.select}
                    value={form.categoria}
                    onChange={e => setForm({ ...form, categoria: e.target.value })}
                  >
                    <option value="">Seleccionar</option>
                    <option>Síntomas</option>
                    <option>Controles</option>
                    <option>Medicamentos</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Respuesta Recomendada</label>
              <textarea
                className={`${styles.textarea} ${styles.textareaLarge}`}
                placeholder="Escribe la respuesta que el sistema proporcionará automáticamente..."
                value={form.respuesta}
                onChange={e => setForm({ ...form, respuesta: e.target.value })}
              />
            </div>

            <div className={styles.formFooter}>
              <button className={styles.guardarBtn} onClick={guardar}>
                Guardar Pregunta
              </button>
            </div>
          </div>

          {/* Resumen */}
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Resumen de preguntas</h2>
            <p className={styles.secDesc}>Visualiza rápidamente cuántas preguntas hay por tipo y categoría.</p>

            <div className={styles.resumenGrid}>
              <div>
                <div className={styles.totalBox}>
                  <span className={styles.totalLabel}>Total de registradas</span>
                  <span className={styles.totalNum}>{preguntas.length}</span>
                </div>
                <p className={styles.label}>Por Tipo</p>
                <table className={styles.resumenTable}>
                  <tbody>
                    <tr>
                      <td className={styles.resumenLabel}>Alta Prioridad</td>
                      <td className={styles.resumenVal}>{alta}</td>
                    </tr>
                    <tr>
                      <td className={styles.resumenLabel}>Media Prioridad</td>
                      <td className={styles.resumenVal}>{medio}</td>
                    </tr>
                    <tr>
                      <td className={styles.resumenLabel}>Baja Prioridad</td>
                      <td className={styles.resumenVal}>{baja}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <p className={styles.label}>Por Categoría</p>
                <table className={styles.resumenTable}>
                  <tbody>
                    {cats.map(cat => (
                      <tr key={cat}>
                        <td className={styles.resumenLabel}>{cat}</td>
                        <td className={styles.resumenVal}>
                          {preguntas.filter(p => p.categoria === cat).length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/*colum derecha de preguntas*/}
        <div className={`${styles.panel} ${styles.panelScroll}`}>
          <h2 className={styles.panelTitle}>Preguntas Registradas</h2>
          <p className={styles.secDesc}>Consulta y administra las preguntas ya creadas desde una sola vista.</p>

          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Pregunta</th>
                <th>Categoría</th>
                <th>Prioridad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {preguntas.map(p => (
                <tr key={p.id}>
                  <td className={styles.pregTexto}>{p.texto}</td>
                  <td className={styles.pregCat}>{p.categoria}</td>
                  <td>
                    <span className={styles.badge} style={colorPrioridad(p.prioridad)}>
                      {p.prioridad}
                    </span>
                  </td>
                  <td>
                    <button
                      className={styles.accionBtn}
                      onClick={() => eliminar(p.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};