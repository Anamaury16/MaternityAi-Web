import { useState, useEffect } from 'react';
import { HeaderActividad } from '../../components/Headers/HeaderActividad/HeaderActividad';
import { Modal } from '../../components/Modal';
import styles from '../../components/admin/AdminOBA.module.css';
import modalStyles from './StaffModal.module.css';
import {
  getEducationalCategories,
  createEducationalCategory,
  updateEducationalCategory,
  getEducationalContents,
  createEducationalContent,
  updateEducationalContent,
  updateEducationalContentStatus,
  type EducationalCategoryResponse,
  type EducationalContentResponse
} from '../../services/adminService';

export const AdminOBA = () => {
  const [categorias, setCategorias] = useState<EducationalCategoryResponse[]>([]);
  const [catActiva, setCatActiva] = useState<EducationalCategoryResponse | null>(null);
  const [contenido, setContenido] = useState<EducationalContentResponse[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modales
  const [modalCatOpen, setModalCatOpen] = useState(false);
  const [modalContOpen, setModalContOpen] = useState(false);

  // Edición
  const [editingCategory, setEditingCategory] = useState<EducationalCategoryResponse | null>(null);
  const [editingContent, setEditingContent] = useState<EducationalContentResponse | null>(null);

  // Form Categoría
  const [catNombre, setCatNombre] = useState('');
  const [catDescripcion, setCatDescripcion] = useState('');
  const [catIcono, setCatIcono] = useState('');
  const [catOrden, setCatOrden] = useState('0');

  // Form Contenido
  const [contTitulo, setContTitulo] = useState('');
  const [contDescripcion, setContDescripcion] = useState('');
  const [contTipo, setContTipo] = useState<'VIDEO' | 'ARTÍCULO'>('ARTÍCULO');
  const [contCuerpo, setContCuerpo] = useState('');
  const [contUrlRecurso, setContUrlRecurso] = useState('');
  const [contUrlImagen, setContUrlImagen] = useState('');
  const [contSemanaInicio, setContSemanaInicio] = useState('1');
  const [contSemanaFin, setContSemanaFin] = useState('40');
  const [contDuracion, setContDuracion] = useState('5');
  const [contOrden, setContOrden] = useState('0');
  const [contCatId, setContCatId] = useState<string>('');

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const cats = await getEducationalCategories();
      setCategorias(cats);

      const conts = await getEducationalContents();
      setContenido(conts);

      if (cats.length > 0) {
        // Mantener seleccionada la categoría previa si existe, o la primera
        setCatActiva(prev => {
          if (prev) {
            const encontrada = cats.find(c => c.id === prev.id);
            if (encontrada) return encontrada;
          }
          return cats[0];
        });
      }
    } catch (err) {
      console.error(err);
      setError('Error al cargar datos del servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Abrir Modal de Categoría
  const openCreateCategory = () => {
    setEditingCategory(null);
    setCatNombre('');
    setCatDescripcion('');
    setCatIcono('');
    setCatOrden('0');
    setModalCatOpen(true);
  };

  const openEditCategory = (cat: EducationalCategoryResponse) => {
    setEditingCategory(cat);
    setCatNombre(cat.nombre);
    setCatDescripcion(cat.descripcion || '');
    setCatIcono(cat.icono || '');
    setCatOrden(cat.orden?.toString() || '0');
    setModalCatOpen(true);
  };

  // Guardar Categoría
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const data = {
        nombre: catNombre,
        descripcion: catDescripcion || null,
        icono: catIcono || null,
        orden: parseInt(catOrden) || 0
      };

      if (editingCategory) {
        await updateEducationalCategory(editingCategory.id, data);
      } else {
        await createEducationalCategory(data);
      }
      setModalCatOpen(false);
      cargarDatos();
    } catch (err) {
      console.error(err);
      setError('Error al guardar la categoría.');
    }
  };

  // Abrir Modal de Contenido
  const openCreateContent = () => {
    setEditingContent(null);
    setContTitulo('');
    setContDescripcion('');
    setContTipo('ARTÍCULO');
    setContCuerpo('');
    setContUrlRecurso('');
    setContUrlImagen('');
    setContSemanaInicio('1');
    setContSemanaFin('40');
    setContDuracion('5');
    setContOrden('0');
    setContCatId(catActiva?.id.toString() || '');
    setModalContOpen(true);
  };

  const openEditContent = (c: EducationalContentResponse) => {
    setEditingContent(c);
    setContTitulo(c.titulo);
    setContDescripcion(c.descripcion || '');
    setContTipo((c.tipo_contenido === 'VIDEO' ? 'VIDEO' : 'ARTÍCULO') as 'VIDEO' | 'ARTÍCULO');
    setContCuerpo(c.cuerpo_texto || '');
    setContUrlRecurso(c.url_recurso || '');
    setContUrlImagen(c.url_imagen || '');
    setContSemanaInicio(c.semana_eg_inicio?.toString() || '1');
    setContSemanaFin(c.semana_eg_fin?.toString() || '40');
    setContDuracion(c.duracion_minutos?.toString() || '5');
    setContOrden(c.orden?.toString() || '0');
    setContCatId(c.categoria_id?.toString() || '');
    setModalContOpen(true);
  };

  // Guardar Contenido
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const data = {
        categoria_id: parseInt(contCatId) || null,
        titulo: contTitulo,
        descripcion: contDescripcion || null,
        tipo_contenido: contTipo,
        cuerpo_texto: contCuerpo || null,
        url_recurso: contUrlRecurso || null,
        url_imagen: contUrlImagen || null,
        semana_eg_inicio: parseInt(contSemanaInicio) || null,
        semana_eg_fin: parseInt(contSemanaFin) || null,
        duracion_minutos: parseInt(contDuracion) || null,
        orden: parseInt(contOrden) || 0
      };

      if (editingContent) {
        await updateEducationalContent(editingContent.id, data);
      } else {
        await createEducationalContent(data);
      }
      setModalContOpen(false);
      cargarDatos();
    } catch (err) {
      console.error(err);
      setError('Error al guardar el contenido.');
    }
  };

  // Toggle estado (activo/desactivo)
  const handleToggleStatus = async (c: EducationalContentResponse) => {
    try {
      await updateEducationalContentStatus(c.id, !c.activo);
      cargarDatos();
    } catch (err) {
      console.error(err);
      setError('Error al cambiar el estado del contenido.');
    }
  };

  const filtrado = contenido.filter(c => c.categoria_id === catActiva?.id);

  const getImagenUrl = (c: EducationalContentResponse) => {
    if (c.url_imagen) return c.url_imagen;
    return c.tipo_contenido === 'VIDEO'
      ? 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=200&fit=crop'
      : 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=200&fit=crop';
  };

  return (
    <div className={styles.root}>
      {/*header con tabs*/}
      <HeaderActividad rol="medico" tabActivo="OBA" />

      {/* Mensaje de error general */}
      {error && (
        <div style={{ margin: '14px 28px 0', padding: '10px 14px', background: '#fdeded', border: '1px solid #ef5350', borderRadius: '8px', color: '#d32f2f', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {/* ── MAIN GRID ── */}
      <div className={styles.grid}>

        {/*categoriass en el panel izquierdo*/}
        <div className={styles.panel}>
          <p className={styles.panelTitle}>Categorías OBA</p>
          <div className={styles.catList}>
            {loading && categorias.length === 0 ? (
              <p className={styles.emptyMsg}>Cargando...</p>
            ) : categorias.length === 0 ? (
              <p className={styles.emptyMsg}>No hay categorías.</p>
            ) : (
              categorias.map(cat => (
                <div
                  key={cat.id}
                  className={`${styles.catItem} ${catActiva?.id === cat.id ? styles.catItemSel : ''}`}
                  onClick={() => setCatActiva(cat)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {cat.nombre}
                  </span>
                  <button
                    className={styles.iconBtn}
                    style={{ padding: '2px', marginLeft: '6px' }}
                    title="Editar Categoría"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditCategory(cat);
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          <button
            className={styles.newBtn}
            style={{ marginTop: '14px', padding: '6px 12px', fontSize: '12px' }}
            onClick={openCreateCategory}
          >
            + Nueva Categoría
          </button>
        </div>

        {/*contenido en el panel derecho*/}
        <div className={`${styles.panel} ${styles.panelScroll}`}>
          <div className={styles.contentHeader}>
            <h2 className={styles.contentTitle}>Contenido: {catActiva?.nombre || 'Seleccione'}</h2>
            <button className={styles.newBtn} onClick={openCreateContent} disabled={!catActiva}>
              + Nuevo Contenido
            </button>
          </div>

          {loading ? (
            <p className={styles.emptyMsg}>Cargando contenidos...</p>
          ) : filtrado.length === 0 ? (
            <p className={styles.emptyMsg}>No hay contenido para esta categoría.</p>
          ) : (
            <div className={styles.obaGrid}>
              {filtrado.map(c => (
                <div key={c.id} className={styles.obaCard} style={{ opacity: c.activo ? 1 : 0.6 }}>
                  <div className={styles.imgWrap}>
                    <img src={getImagenUrl(c)} alt={c.titulo} className={styles.img} />
                    <span className={styles.badge}>{c.tipo_contenido}</span>
                    {c.tipo_contenido === 'VIDEO' && (
                      <div className={styles.playBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{c.titulo}</h3>
                    <p className={styles.cardDesc}>{c.descripcion}</p>
                    <p style={{ fontSize: '11px', color: '#888', margin: '0 0 10px' }}>
                      EG: Semanas {c.semana_eg_inicio}-{c.semana_eg_fin} | Duración: {c.duracion_minutos} min
                    </p>
                    <div className={styles.cardActions}>
                      {/* Estado activo/inactivo */}
                      <button
                        className={styles.iconBtn}
                        title={c.activo ? "Desactivar" : "Activar"}
                        onClick={() => handleToggleStatus(c)}
                        style={{ color: c.activo ? '#4caf50' : '#f44336' }}
                      >
                        {c.activo ? (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        ) : (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        )}
                      </button>

                      {/* Editar */}
                      <button className={styles.iconBtn} title="Editar" onClick={() => openEditContent(c)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ── MODAL CATEGORÍA ── */}
      <Modal
        isOpen={modalCatOpen}
        onClose={() => setModalCatOpen(false)}
        title={editingCategory ? "Editar Categoría" : "Nueva Categoría"}
      >
        <form onSubmit={handleSaveCategory} className={modalStyles.form}>
          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Nombre de la Categoría *</label>
            <input
              type="text"
              required
              className={modalStyles.input}
              value={catNombre}
              onChange={e => setCatNombre(e.target.value)}
              placeholder="Ej. Nutrición"
            />
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Descripción</label>
            <input
              type="text"
              className={modalStyles.input}
              value={catDescripcion}
              onChange={e => setCatDescripcion(e.target.value)}
              placeholder="Descripción opcional"
            />
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Icono (Nombre de icono)</label>
            <input
              type="text"
              className={modalStyles.input}
              value={catIcono}
              onChange={e => setCatIcono(e.target.value)}
              placeholder="Ej. heart, activity, book"
            />
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Orden de prioridad</label>
            <input
              type="number"
              className={modalStyles.input}
              value={catOrden}
              onChange={e => setCatOrden(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className={modalStyles.actions}>
            <button type="button" className={modalStyles.cancelBtn} onClick={() => setModalCatOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className={modalStyles.submitBtn}>
              Guardar
            </button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL CONTENIDO ── */}
      <Modal
        isOpen={modalContOpen}
        onClose={() => setModalContOpen(false)}
        title={editingContent ? "Editar Recurso Educativo" : "Nuevo Recurso Educativo"}
      >
        <form onSubmit={handleSaveContent} className={modalStyles.form}>
          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Categoría *</label>
            <select
              required
              className={modalStyles.select}
              value={contCatId}
              onChange={e => setContCatId(e.target.value)}
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Título *</label>
            <input
              type="text"
              required
              className={modalStyles.input}
              value={contTitulo}
              onChange={e => setContTitulo(e.target.value)}
              placeholder="Título del artículo o video"
            />
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Descripción corta</label>
            <input
              type="text"
              className={modalStyles.input}
              value={contDescripcion}
              onChange={e => setContDescripcion(e.target.value)}
              placeholder="Resumen del recurso"
            />
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Tipo de contenido</label>
            <select
              className={modalStyles.select}
              value={contTipo}
              onChange={e => setContTipo(e.target.value as 'VIDEO' | 'ARTÍCULO')}
            >
              <option value="ARTÍCULO">Artículo</option>
              <option value="VIDEO">Video</option>
            </select>
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Cuerpo / Texto del Artículo</label>
            <textarea
              className={modalStyles.input}
              style={{ minHeight: '100px', resize: 'vertical' }}
              value={contCuerpo}
              onChange={e => setContCuerpo(e.target.value)}
              placeholder="Contenido en texto"
            />
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>URL del Recurso / Video</label>
            <input
              type="text"
              className={modalStyles.input}
              value={contUrlRecurso}
              onChange={e => setContUrlRecurso(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>URL de la Imagen</label>
            <input
              type="text"
              className={modalStyles.input}
              value={contUrlImagen}
              onChange={e => setContUrlImagen(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Semana EG Inicio</label>
              <input
                type="number"
                className={modalStyles.input}
                value={contSemanaInicio}
                onChange={e => setContSemanaInicio(e.target.value)}
              />
            </div>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Semana EG Fin</label>
              <input
                type="number"
                className={modalStyles.input}
                value={contSemanaFin}
                onChange={e => setContSemanaFin(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Duración (minutos)</label>
              <input
                type="number"
                className={modalStyles.input}
                value={contDuracion}
                onChange={e => setContDuracion(e.target.value)}
              />
            </div>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Orden</label>
              <input
                type="number"
                className={modalStyles.input}
                value={contOrden}
                onChange={e => setContOrden(e.target.value)}
              />
            </div>
          </div>

          <div className={modalStyles.actions}>
            <button type="button" className={modalStyles.cancelBtn} onClick={() => setModalContOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className={modalStyles.submitBtn}>
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};