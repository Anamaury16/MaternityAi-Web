import { useState, useEffect } from 'react';
import { HeaderActividad } from '../../components/Headers/HeaderActividad/HeaderActividad';
import { Modal } from '../../components/Modal';
import styles from '../../components/admin/AdminPreguntas.module.css';
import modalStyles from './StaffModal.module.css';
import {
  getFollowUpQuestions,
  createFollowUpQuestion,
  updateFollowUpQuestion,
  updateFollowUpQuestionStatus,
  type FollowUpQuestionUpdate
} from '../../services/adminService';

interface Pregunta {
  id: number;
  texto: string;
  categoria: string;
  prioridad: 'Alta' | 'Medio' | 'Baja';
  respuesta: string;
  tipo_respuesta: string;
  modulo_id?: number | null;
  frecuencia?: string | null;
  es_signo_alarma: boolean;
  prioridad_alerta_default_id?: number | null;
  orden?: number | null;
}

const MODULOS = [
  { id: 1, nombre: 'M0 - Perfil Clínico' },
  { id: 2, nombre: 'M1 - Primer Trimestre' },
  { id: 3, nombre: 'M2 - Segundo Trimestre' },
  { id: 4, nombre: 'M3 - Tercer Trimestre' },
];

const PRIORIDADES = [
  { id: 1, nombre: 'Informativo' },
  { id: 2, nombre: 'Bajo' },
  { id: 3, nombre: 'Moderado' },
  { id: 4, nombre: 'Alto' },
];

const TIPOS_RESPUESTA = [
  { value: 'si_no', label: 'Sí / No' },
  { value: 'escala_numerica', label: 'Escala numérica' },
  { value: 'texto_libre', label: 'Texto libre' },
];

const FRECUENCIAS = [
  { value: 'diaria', label: 'Diaria' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'unica', label: 'Única' },
];

const getModuloLabel = (id?: number | null) =>
  MODULOS.find(m => m.id === id)?.nombre ?? '—';

const getPrioridadLabel = (id?: number | null) =>
  PRIORIDADES.find(p => p.id === id)?.nombre ?? '—';

const getTipoRespuestaLabel = (value?: string | null) =>
  TIPOS_RESPUESTA.find(t => t.value === value)?.label ?? (value || '—');

const getFrecuenciaLabel = (value?: string | null) =>
  FRECUENCIAS.find(f => f.value === value)?.label ?? (value || '—');

export const AdminPreguntas = () => {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    descripcion: '',
    prioridad: '',
    categoria: '',
    respuesta: '',
  });

  // ─── Modal de detalle / edición ───────────────────────────────────────────
  const [selected, setSelected] = useState<Pregunta | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<FollowUpQuestionUpdate>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fetchPreguntas = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getFollowUpQuestions({ page: 1, size: 100 });
      // Filtrar activas y mapear campos a la estructura visual del frontend
      const mapped = data.filter(q => q.activo).map((q) => {
        let prioridad: 'Alta' | 'Medio' | 'Baja' = 'Baja';
        if (q.prioridad_alerta_default_id === 4) prioridad = 'Alta';
        else if (q.prioridad_alerta_default_id === 3) prioridad = 'Medio';

        let categoria = 'Síntomas';
        if (q.modulo_id === 3) categoria = 'Controles';
        else if (q.modulo_id === 4) categoria = 'Medicamentos';

        return {
          id: q.id,
          texto: q.texto_pregunta,
          categoria,
          prioridad,
          respuesta: '', // respuesta no se mapea en el backend de seguimiento directo
          tipo_respuesta: q.tipo_respuesta,
          modulo_id: q.modulo_id,
          frecuencia: q.frecuencia,
          es_signo_alarma: q.es_signo_alarma,
          prioridad_alerta_default_id: q.prioridad_alerta_default_id,
          orden: q.orden,
        };
      });
      setPreguntas(mapped);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Error al cargar preguntas del servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreguntas();
  }, []);

  const guardar = async () => {
    if (!form.descripcion || !form.prioridad || !form.categoria) return;
    setErrorMsg(null);

    // Mapear prioridad visual a ID de prioridad en base de datos
    let priorityId = 2; // Riesgo bajo (verde)
    if (form.prioridad === 'Alta') priorityId = 4; // Riesgo alto (rojo)
    else if (form.prioridad === 'Medio') priorityId = 3; // Riesgo moderado (amarillo)

    // Mapear categoría visual a ID de módulo clínico
    let moduloId = 2; // Primer Trimestre (M1) -> Síntomas
    if (form.categoria === 'Controles') moduloId = 3; // Segundo Trimestre (M2) -> Controles
    else if (form.categoria === 'Medicamentos') moduloId = 4; // Tercer Trimestre (M3) -> Medicamentos

    try {
      await createFollowUpQuestion({
        texto_pregunta: form.descripcion,
        tipo_respuesta: 'si_no',
        modulo_id: moduloId,
        frecuencia: 'diaria',
        es_signo_alarma: form.prioridad === 'Alta' || form.prioridad === 'Medio',
        prioridad_alerta_default_id: priorityId,
        orden: 0
      });
      setForm({ descripcion: '', prioridad: '', categoria: '', respuesta: '' });
      await fetchPreguntas();
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Error al guardar la pregunta en el servidor.');
    }
  };

  const eliminar = async (id: number) => {
    setErrorMsg(null);
    try {
      await updateFollowUpQuestionStatus(id, false);
      await fetchPreguntas();
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Error al eliminar la pregunta en el servidor.');
    }
  };

  const verDetalle = (p: Pregunta) => {
    setSelected(p);
    setIsEditing(false);
    setSaveError(null);
  };

  const cerrarModal = () => {
    setSelected(null);
    setIsEditing(false);
    setSaveError(null);
  };

  const iniciarEdicion = () => {
    if (!selected) return;
    setEditForm({
      texto_pregunta: selected.texto,
      tipo_respuesta: selected.tipo_respuesta,
      modulo_id: selected.modulo_id,
      frecuencia: selected.frecuencia,
      es_signo_alarma: selected.es_signo_alarma,
      prioridad_alerta_default_id: selected.prioridad_alerta_default_id,
      orden: selected.orden,
    });
    setSaveError(null);
    setIsEditing(true);
  };

  const guardarEdicion = async () => {
    if (!selected) return;
    setSaving(true);
    setSaveError(null);
    try {
      await updateFollowUpQuestion(selected.id, editForm);
      await fetchPreguntas();
      cerrarModal();
    } catch (err: any) {
      console.error(err);
      setSaveError('Error al actualizar la pregunta en el servidor.');
    } finally {
      setSaving(false);
    }
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
            {errorMsg && <p style={{ color: '#dc2626', fontSize: '13px', margin: '8px 0 0 0', fontWeight: '500' }}>⚠️ {errorMsg}</p>}
            {loading && <p style={{ color: '#666', fontSize: '12px', margin: '8px 0 0 0' }}>Cargando preguntas...</p>}


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
                <tr
                  key={p.id}
                  onClick={() => verDetalle(p)}
                  style={{ cursor: 'pointer' }}
                >
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
                      onClick={(e) => { e.stopPropagation(); eliminar(p.id); }}
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

      {/* Modal de detalle / edición de pregunta */}
      {selected && (
        <Modal
          isOpen={!!selected}
          onClose={cerrarModal}
          title={isEditing ? 'Editar Pregunta' : 'Detalle de la Pregunta'}
        >
          {!isEditing ? (
            <div className={modalStyles.form}>
              <div className={modalStyles.field}>
                <span className={modalStyles.label}>Texto de la pregunta</span>
                <span>{selected.texto}</span>
              </div>
              <div className={modalStyles.field}>
                <span className={modalStyles.label}>Tipo de respuesta</span>
                <span>{getTipoRespuestaLabel(selected.tipo_respuesta)}</span>
              </div>
              <div className={modalStyles.field}>
                <span className={modalStyles.label}>Módulo</span>
                <span>{getModuloLabel(selected.modulo_id)}</span>
              </div>
              <div className={modalStyles.field}>
                <span className={modalStyles.label}>Frecuencia</span>
                <span>{getFrecuenciaLabel(selected.frecuencia)}</span>
              </div>
              <div className={modalStyles.field}>
                <span className={modalStyles.label}>¿Es signo de alarma?</span>
                <span>{selected.es_signo_alarma ? 'Sí' : 'No'}</span>
              </div>
              <div className={modalStyles.field}>
                <span className={modalStyles.label}>Prioridad de alerta</span>
                <span>{getPrioridadLabel(selected.prioridad_alerta_default_id)}</span>
              </div>
              <div className={modalStyles.field}>
                <span className={modalStyles.label}>Orden</span>
                <span>{selected.orden ?? '—'}</span>
              </div>

              {saveError && <p className={modalStyles.error}>{saveError}</p>}

              <div className={modalStyles.actions}>
                <button type="button" className={modalStyles.cancelBtn} onClick={cerrarModal}>
                  Cerrar
                </button>
                <button type="button" className={modalStyles.submitBtn} onClick={iniciarEdicion}>
                  Editar
                </button>
              </div>
            </div>
          ) : (
            <form
              className={modalStyles.form}
              onSubmit={(e) => { e.preventDefault(); guardarEdicion(); }}
            >
              <div className={modalStyles.field}>
                <label className={modalStyles.label}>Texto de la pregunta</label>
                <textarea
                  className={modalStyles.input}
                  value={editForm.texto_pregunta ?? ''}
                  onChange={e => setEditForm({ ...editForm, texto_pregunta: e.target.value })}
                />
              </div>

              <div className={modalStyles.field}>
                <label className={modalStyles.label}>Tipo de respuesta</label>
                <select
                  className={modalStyles.select}
                  value={editForm.tipo_respuesta ?? ''}
                  onChange={e => setEditForm({ ...editForm, tipo_respuesta: e.target.value })}
                >
                  {TIPOS_RESPUESTA.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className={modalStyles.field}>
                <label className={modalStyles.label}>Módulo</label>
                <select
                  className={modalStyles.select}
                  value={editForm.modulo_id ?? ''}
                  onChange={e => setEditForm({ ...editForm, modulo_id: Number(e.target.value) })}
                >
                  {MODULOS.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              </div>

              <div className={modalStyles.field}>
                <label className={modalStyles.label}>Frecuencia</label>
                <select
                  className={modalStyles.select}
                  value={editForm.frecuencia ?? ''}
                  onChange={e => setEditForm({ ...editForm, frecuencia: e.target.value })}
                >
                  {FRECUENCIAS.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>

              <div className={modalStyles.field}>
                <label className={modalStyles.label}>
                  <input
                    type="checkbox"
                    checked={!!editForm.es_signo_alarma}
                    onChange={e => setEditForm({ ...editForm, es_signo_alarma: e.target.checked })}
                  />{' '}
                  ¿Es signo de alarma?
                </label>
              </div>

              <div className={modalStyles.field}>
                <label className={modalStyles.label}>Prioridad de alerta</label>
                <select
                  className={modalStyles.select}
                  value={editForm.prioridad_alerta_default_id ?? ''}
                  onChange={e => setEditForm({ ...editForm, prioridad_alerta_default_id: Number(e.target.value) })}
                >
                  {PRIORIDADES.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>

              <div className={modalStyles.field}>
                <label className={modalStyles.label}>Orden</label>
                <input
                  type="number"
                  className={modalStyles.input}
                  value={editForm.orden ?? 0}
                  onChange={e => setEditForm({ ...editForm, orden: Number(e.target.value) })}
                />
              </div>

              {saveError && <p className={modalStyles.error}>{saveError}</p>}

              <div className={modalStyles.actions}>
                <button type="button" className={modalStyles.cancelBtn} onClick={() => setIsEditing(false)} disabled={saving}>
                  Cancelar
                </button>
                <button type="submit" className={modalStyles.submitBtn} disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};