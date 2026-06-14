import { useState, useEffect, useCallback } from 'react';
import { HeaderActividad } from '../../components/Headers/HeaderActividad/HeaderActividad';
import { Modal } from '../../components/Modal';
import styles from '../../components/admin/AdminChecklist.module.css';
import modalStyles from './StaffModal.module.css';
import {
  getChecklistItems,
  createChecklistItem,
  updateChecklistItem,
  updateChecklistItemStatus,
  type ChecklistItemResponse,
  type ChecklistItemCreate,
  type ChecklistItemUpdate,
} from '../../services/adminService';

// ─── Toast ────────────────────────────────────────────────────────────────────

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

let toastCounter = 0;

const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = ++toastCounter;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  return { toasts, addToast };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SKELETON_ROWS = 6;

const emptyForm = (): ChecklistItemCreate => ({
  texto: '',
  modulo_id: null,
  semana_eg: null,
  orden: null,
});

// ─── Component ────────────────────────────────────────────────────────────────

export const AdminChecklist = () => {
  // Data
  const [items, setItems] = useState<ChecklistItemResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Toast
  const { toasts, addToast } = useToast();

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ChecklistItemResponse | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState<ChecklistItemCreate>(emptyForm());

  // Per-row toggle loading
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getChecklistItems();
      setItems(data);
    } catch (err) {
      console.error(err);
      addToast('Error al cargar los ítems del checklist.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // ── Open modal ───────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (item: ChecklistItemResponse) => {
    setEditing(item);
    setForm({
      texto: item.texto,
      modulo_id: item.modulo_id,
      semana_eg: item.semana_eg,
      orden: item.orden,
    });
    setModalOpen(true);
  };

  // ── Save (Create / Update) ────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        texto: form.texto.trim(),
        modulo_id: form.modulo_id ?? null,
        semana_eg: form.semana_eg ?? null,
        orden: form.orden ?? null,
      };

      if (editing) {
        const updated: ChecklistItemUpdate = payload;
        const result = await updateChecklistItem(editing.id, updated);
        setItems(prev => prev.map(i => (i.id === result.id ? result : i)));
        addToast('Ítem actualizado correctamente.', 'success');
      } else {
        const result = await createChecklistItem(payload);
        setItems(prev => [...prev, result]);
        addToast('Ítem creado correctamente.', 'success');
      }

      setModalOpen(false);
    } catch (err) {
      console.error(err);
      addToast(
        editing
          ? 'Error al actualizar el ítem.'
          : 'Error al crear el ítem.',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle status ─────────────────────────────────────────────────────────
  const handleToggle = async (item: ChecklistItemResponse) => {
    setTogglingId(item.id);
    try {
      const result = await updateChecklistItemStatus(item.id, !item.activo);
      setItems(prev => prev.map(i => (i.id === result.id ? result : i)));
      addToast(
        result.activo ? 'Ítem activado.' : 'Ítem desactivado.',
        'success'
      );
    } catch (err) {
      console.error(err);
      addToast('Error al cambiar el estado del ítem.', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.root}>
      <HeaderActividad rol="medico" tabActivo="Checklist" />

      {/* ── Toast Layer ── */}
      <div className={styles.toastWrapper}>
        {toasts.map(t => (
          <div
            key={t.id}
            className={`${styles.toast} ${
              t.type === 'success' ? styles.toastSuccess : styles.toastError
            }`}
          >
            {t.type === 'success' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            {t.message}
          </div>
        ))}
      </div>

      {/* ── Page content ── */}
      <div className={styles.pageWrapper}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <h1 className={styles.pageTitle}>Ítems del Checklist</h1>
            <p className={styles.pageSubtitle}>
              Plantilla maestra de tareas por semana de gestación y módulo clínico.
            </p>
          </div>
          <button className={styles.newBtn} onClick={openCreate} id="btn-nuevo-checklist-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuevo Ítem
          </button>
        </div>

        {/* Data table */}
        <div className={styles.panel}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Texto / Tarea</th>
                  <th>Módulo</th>
                  <th>Semana EG</th>
                  <th>Orden</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  /* Skeleton rows */
                  Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                    <tr key={i} className={styles.skeletonRow}>
                      <td><div className={styles.skeletonBar} style={{ width: 32 }} /></td>
                      <td><div className={styles.skeletonBar} style={{ width: '70%' }} /></td>
                      <td><div className={styles.skeletonBar} style={{ width: 48 }} /></td>
                      <td><div className={styles.skeletonBar} style={{ width: 40 }} /></td>
                      <td><div className={styles.skeletonBar} style={{ width: 30 }} /></td>
                      <td><div className={styles.skeletonBar} style={{ width: 44 }} /></td>
                      <td><div className={styles.skeletonBar} style={{ width: 54 }} /></td>
                    </tr>
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className={styles.emptyState}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                          stroke="#CA436E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 11l3 3L22 4" />
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                        <p>No hay ítems de checklist configurados.</p>
                        <p style={{ fontSize: 12, color: '#ccc' }}>
                          Haz clic en "Nuevo Ítem" para agregar el primero.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map(item => (
                    <tr key={item.id}>
                      {/* ID */}
                      <td>
                        <span className={styles.idBadge}>#{item.id}</span>
                      </td>

                      {/* Texto */}
                      <td className={styles.textoCell}>{item.texto}</td>

                      {/* Módulo */}
                      <td>
                        {item.modulo_id != null ? (
                          item.modulo_id
                        ) : (
                          <span className={styles.nullBadge}>—</span>
                        )}
                      </td>

                      {/* Semana EG */}
                      <td>
                        {item.semana_eg != null ? (
                          `Sem. ${item.semana_eg}`
                        ) : (
                          <span className={styles.nullBadge}>—</span>
                        )}
                      </td>

                      {/* Orden */}
                      <td>
                        {item.orden != null ? (
                          item.orden
                        ) : (
                          <span className={styles.nullBadge}>—</span>
                        )}
                      </td>

                      {/* Toggle Estado */}
                      <td>
                        <div className={styles.switchWrapper}>
                          {togglingId === item.id ? (
                            <div className={styles.switchLoading} aria-label="Cambiando estado..." />
                          ) : (
                            <label
                              className={styles.switch}
                              title={item.activo ? 'Desactivar ítem' : 'Activar ítem'}
                              id={`toggle-checklist-${item.id}`}
                            >
                              <input
                                type="checkbox"
                                checked={item.activo}
                                onChange={() => handleToggle(item)}
                              />
                              <span className={styles.slider} />
                            </label>
                          )}
                        </div>
                      </td>

                      {/* Acciones */}
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={styles.iconBtn}
                            title="Editar ítem"
                            id={`btn-editar-checklist-${item.id}`}
                            onClick={() => openEdit(item)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── MODAL Create / Edit ── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        title={editing ? 'Editar Ítem de Checklist' : 'Nuevo Ítem de Checklist'}
      >
        <form onSubmit={handleSave} className={modalStyles.form}>
          {/* Texto */}
          <div className={modalStyles.field}>
            <label className={modalStyles.label} htmlFor="ci-texto">
              Texto / Tarea <span style={{ color: '#CA436E' }}>*</span>
            </label>
            <textarea
              id="ci-texto"
              required
              className={modalStyles.input}
              style={{ minHeight: 80, resize: 'vertical' }}
              placeholder="Ej. Tomar ácido fólico diariamente"
              value={form.texto}
              onChange={e => setForm({ ...form, texto: e.target.value })}
            />
          </div>

          {/* Módulo ID + Semana EG */}
          <div className={styles.formGrid2}>
            <div className={modalStyles.field}>
              <label className={modalStyles.label} htmlFor="ci-modulo">
                ID de Módulo
              </label>
              <input
                id="ci-modulo"
                type="number"
                min={1}
                className={modalStyles.input}
                placeholder="Ej. 1"
                value={form.modulo_id ?? ''}
                onChange={e =>
                  setForm({
                    ...form,
                    modulo_id: e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              />
            </div>

            <div className={modalStyles.field}>
              <label className={modalStyles.label} htmlFor="ci-semana">
                Semana EG
              </label>
              <input
                id="ci-semana"
                type="number"
                min={1}
                max={42}
                className={modalStyles.input}
                placeholder="1 – 42"
                value={form.semana_eg ?? ''}
                onChange={e =>
                  setForm({
                    ...form,
                    semana_eg: e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          {/* Orden */}
          <div className={modalStyles.field}>
            <label className={modalStyles.label} htmlFor="ci-orden">
              Orden de visualización
            </label>
            <input
              id="ci-orden"
              type="number"
              min={0}
              className={modalStyles.input}
              placeholder="Ej. 1"
              value={form.orden ?? ''}
              onChange={e =>
                setForm({
                  ...form,
                  orden: e.target.value === '' ? null : Number(e.target.value),
                })
              }
            />
          </div>

          {/* Actions */}
          <div className={modalStyles.actions}>
            <button
              type="button"
              className={modalStyles.cancelBtn}
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={modalStyles.submitBtn}
              disabled={saving || !form.texto.trim()}
              id="btn-guardar-checklist-item"
            >
              {saving ? 'Guardando…' : editing ? 'Actualizar' : 'Crear Ítem'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
