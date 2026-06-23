import { useState, useEffect } from 'react';
import { HeaderActividad } from '../../components/Headers/HeaderActividad/HeaderActividad';
import styles from '../../components/admin/AdminCargas.module.css';
import { 
  uploadExcel, 
  getHistorialCargas, 
  getDetalleCarga,
  type CargaExcelResponse,
  type CargaExcelDetalleResponse,
  getCatalogItems,
  createCatalogItem,
  updateCatalogItem,
  updateCatalogStatus,
  type CatalogoItem
} from '../../services/adminService';

// ─── SVG Icons ───
const SvgDownload = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const SvgRefresh = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M23 4v6h-6" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

export const AdminCargas = () => {
  const [activeSubTab, setActiveSubTab] = useState<'excel' | 'catalogs'>('excel');

  // ─── Excel Cargas State ───
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cargas, setCargas] = useState<CargaExcelResponse[]>([]);
  const [selectedCarga, setSelectedCarga] = useState<CargaExcelDetalleResponse | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // ─── Catálogos State ───
  const [selectedCatalog, setSelectedCatalog] = useState<string>('nacionalidad');
  const [catalogItems, setCatalogItems] = useState<CatalogoItem[]>([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  
  // Catalog Form State
  const [editingItem, setEditingItem] = useState<CatalogoItem | null>(null);
  const [formNombre, setFormNombre] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fetchCargas = async () => {
    try {
      const data = await getHistorialCargas();
      setCargas(data);
    } catch (err) {
      console.error('Error fetching historial cargas:', err);
    }
  };

  const fetchCatalogItems = async (catalogName: string) => {
    setIsCatalogLoading(true);
    setFormError(null);
    try {
      const items = await getCatalogItems(catalogName);
      setCatalogItems(items);
    } catch (err: any) {
      console.error('Error fetching catalog items:', err);
    } finally {
      setIsCatalogLoading(false);
    }
  };

  useEffect(() => {
    fetchCargas();
  }, []);

  useEffect(() => {
    if (activeSubTab === 'catalogs') {
      fetchCatalogItems(selectedCatalog);
      setEditingItem(null);
      setFormNombre('');
      setFormError(null);
      setFormSuccess(null);
    }
  }, [activeSubTab, selectedCatalog]);

  // ─── Excel Cargas Handlers ───
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await uploadExcel(file);
      setFile(null);
      const fileInput = document.getElementById('excel-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      setSuccessMsg('¡Archivo cargado y procesado exitosamente! Revisa el historial para ver el detalle de cada fila.');
      await fetchCargas();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || err.message || 'Error al subir el archivo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectCarga = async (id: string) => {
    setIsLoadingDetails(true);
    try {
      const detalle = await getDetalleCarga(id);
      setSelectedCarga(detalle);
    } catch (err) {
      console.error('Error fetching detalle carga:', err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // ─── Catálogos Handlers ───
  const handleSaveCatalogItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!formNombre.trim()) {
      setFormError('El nombre es obligatorio');
      return;
    }

    try {
      if (editingItem) {
        await updateCatalogItem(selectedCatalog, editingItem.id, {
          nombre: formNombre.trim(),
        });
        setFormSuccess('Ítem actualizado exitosamente');
      } else {
        await createCatalogItem(selectedCatalog, {
          nombre: formNombre.trim(),
        });
        setFormSuccess('Ítem creado exitosamente');
      }
      
      setEditingItem(null);
      setFormNombre('');
      await fetchCatalogItems(selectedCatalog);
    } catch (err: any) {
      setFormError(err.response?.data?.detail || err.message || 'Error al guardar');
    }
  };

  const handleEditClick = (item: CatalogoItem) => {
    setEditingItem(item);
    setFormNombre(item.nombre);
    setFormError(null);
    setFormSuccess(null);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setFormNombre('');
    setFormError(null);
    setFormSuccess(null);
  };

  const handleToggleStatus = async (item: CatalogoItem) => {
    try {
      await updateCatalogStatus(selectedCatalog, item.id, !item.activo);
      await fetchCatalogItems(selectedCatalog);
    } catch (err: any) {
      alert(err.response?.data?.detail || err.message || 'Error al cambiar estado');
    }
  };

  // Filtro de búsqueda
  const filteredCatalogItems = catalogItems.filter(item => {
    const searchLower = catalogSearch.toLowerCase();
    const nombreMatch = item.nombre.toLowerCase().includes(searchLower);
    const codigoMatch = item.codigo ? item.codigo.toLowerCase().includes(searchLower) : false;
    return nombreMatch || codigoMatch;
  });

  return (
    <div className={styles.root}>
      <HeaderActividad rol="medico" tabActivo="Cargas" />

      <div className={styles.mainContainer}>
        {/* Sub-navegación de pestañas */}
        <div className={styles.subTabBar}>
          <button 
            className={`${styles.subTabButton} ${activeSubTab === 'excel' ? styles.active : ''}`}
            onClick={() => setActiveSubTab('excel')}
          >
            Carga Masiva (Excel)
          </button>
          <button 
            className={`${styles.subTabButton} ${activeSubTab === 'catalogs' ? styles.active : ''}`}
            onClick={() => setActiveSubTab('catalogs')}
          >
            Catálogos y Tablas SQL
          </button>
        </div>

        {activeSubTab === 'excel' ? (
          <div className={styles.grid}>
            {/* Panel Izquierdo: Subir Excel e Historial */}
            <div className={`${styles.panel} ${styles.panelLeft}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 className={styles.panelTitle} style={{ margin: 0 }}>Carga Masiva</h2>
                <a 
                  href="/plantilla_carga_masiva.xlsx" 
                  download="plantilla_carga_masiva.xlsx"
                  style={{
                    color: '#CA436E',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <SvgDownload size={16} />
                  Descargar Plantilla (.xlsx)
                </a>
              </div>
              
              <div className={styles.uploadSection}>
                <label htmlFor="excel-upload" className={styles.fileInputLabel}>
                  {file ? file.name : 'Haz clic para seleccionar archivo .xlsx'}
                </label>
                <input 
                  id="excel-upload"
                  type="file" 
                  accept=".xlsx"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
                {errorMsg && <p className={styles.errorMessage}>{errorMsg}</p>}
                {successMsg && <p className={styles.successMessage}>{successMsg}</p>}
                <button 
                  className={styles.uploadBtn}
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                >
                  {isUploading ? 'Procesando archivo...' : 'Cargar Excel'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', marginBottom: '10px' }}>
                <h2 className={styles.panelTitle} style={{ margin: 0 }}>Historial</h2>
                <button 
                  onClick={fetchCargas} 
                  style={{ 
                    padding: '5px 12px', 
                    fontSize: '0.8rem', 
                    cursor: 'pointer', 
                    border: '1px solid #CA436E', 
                    borderRadius: '15px', 
                    color: '#CA436E', 
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '600'
                  }}
                >
                  <SvgRefresh size={14} />
                  Refrescar
                </button>
              </div>
              <div style={{ overflowY: 'auto' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Archivo</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cargas.map((carga) => (
                      <tr 
                        key={carga.id} 
                        className={`${styles.row} ${selectedCarga?.id === carga.id ? styles.rowSelected : ''}`}
                        onClick={() => handleSelectCarga(carga.id)}
                      >
                        <td>{carga.archivo_nombre}</td>
                        <td>{carga.created_at ? new Date(carga.created_at).toLocaleDateString() : '-'}</td>
                        <td>
                          <span className={`${styles.badge} ${carga.estado === 'completado' ? styles.completado : styles.error}`}>
                            {carga.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Panel Derecho: Detalles de la Carga Seleccionada */}
            <div className={`${styles.panel} ${styles.panelRight}`}>
              {isLoadingDetails ? (
                <div className={styles.emptyState}>Cargando detalles...</div>
              ) : selectedCarga ? (
                <>
                  <div className={styles.detailHeader}>
                    <h2 className={styles.panelTitle}>Detalle de Carga</h2>
                    <span className={styles.badge}>{selectedCarga.archivo_nombre}</span>
                  </div>

                  <div className={styles.detailStats}>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>{selectedCarga.total_gestantes ?? 0}</div>
                      <div className={styles.statLabel}>Total Gestantes</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>{selectedCarga.nuevas ?? 0}</div>
                      <div className={styles.statLabel}>Nuevas</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>{selectedCarga.actualizadas ?? 0}</div>
                      <div className={styles.statLabel}>Actualizadas</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>{selectedCarga.errores ?? 0}</div>
                      <div className={styles.statLabel}>Errores</div>
                    </div>
                  </div>

                  {selectedCarga.detalles && (() => {
                    const filasConError = selectedCarga.detalles.filter(
                      d => d.estado !== 'ok' && d.mensaje_error
                    );
                    return (
                      <>
                        <h3 className={styles.errorsTitle}>Registro de Problemas</h3>
                        {filasConError.length === 0 ? (
                          <p style={{ color: '#2e7d32', fontWeight: '500', marginTop: '8px' }}>
                            ✅ Todas las filas se procesaron correctamente, sin errores.
                          </p>
                        ) : (
                          <div className={styles.errorList}>
                            {filasConError.map((detalle, idx) => (
                              <div key={idx} className={styles.errorItem}>
                                <div className={styles.errorLocation}>
                                  {detalle.hoja} - Fila {detalle.fila_numero}
                                </div>
                                <div className={styles.errorMessage}>
                                  {detalle.mensaje_error}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </>
              ) : (
                <div className={styles.emptyState}>
                  <p>Selecciona una carga del historial para ver sus detalles</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.grid}>
            {/* Panel Izquierdo: Selector y Formulario de Edición */}
            <div className={`${styles.panel} ${styles.panelLeft}`}>
              <h2 className={styles.panelTitle}>Gestión de Catálogo</h2>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Selecciona el Catálogo</label>
                <select
                  className={styles.formSelect}
                  value={selectedCatalog}
                  onChange={(e) => setSelectedCatalog(e.target.value)}
                >
                  <option value="nacionalidad">Nacionalidad</option>
                  <option value="eapb">EAPB / EPS</option>
                  <option value="pertenencia-etnica">Pertenencia Étnica</option>
                  <option value="grupo-poblacional">Grupo Poblacional</option>
                </select>
              </div>

              <hr style={{ border: 'none', borderBottom: '1px solid #eee', margin: '20px 0' }} />

              <h3 className={styles.panelTitle}>
                {editingItem ? 'Editar Registro' : 'Agregar Registro'}
              </h3>
              
              <form onSubmit={handleSaveCatalogItem}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nombre (obligatorio)</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Ej: Colombiana"
                    value={formNombre}
                    onChange={(e) => setFormNombre(e.target.value)}
                    required
                  />
                </div>

                {formError && <p className={styles.errorMessage} style={{ marginBottom: 10 }}>{formError}</p>}
                {formSuccess && <p className={styles.successMessage}>{formSuccess}</p>}

                <div className={styles.formActions}>
                  {editingItem && (
                    <button
                      type="button"
                      className={styles.secondaryBtn}
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    className={styles.primaryBtn}
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>

            {/* Panel Derecho: Tabla de Registros */}
            <div className={`${styles.panel} ${styles.panelRight}`}>
              <div className={styles.detailHeader}>
                <h2 className={styles.panelTitle}>Registros en Base de Datos</h2>
                <span className={styles.badge} style={{ textTransform: 'capitalize', backgroundColor: '#e2e8f0', color: '#475569' }}>
                  {selectedCatalog.replace('-', ' ')}
                </span>
              </div>

              <div className={styles.searchBox}>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Buscar por nombre o código..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                />
              </div>

              {isCatalogLoading ? (
                <div className={styles.emptyState}>Cargando registros...</div>
              ) : filteredCatalogItems.length === 0 ? (
                <div className={styles.emptyState}>
                  No se encontraron registros para este catálogo
                </div>
              ) : (
                <div style={{ overflowY: 'auto', flex: 1 }}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCatalogItems.map((item) => (
                        <tr key={item.id} className={styles.row} style={{ cursor: 'default' }}>
                          <td>{item.codigo || '-'}</td>
                          <td style={{ fontWeight: '500' }}>{item.nombre}</td>
                          <td>
                            <span className={`${styles.badge} ${item.activo ? styles.completado : styles.error}`}>
                              {item.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actionButtons}>
                              <button
                                className={styles.editBtn}
                                onClick={() => handleEditClick(item)}
                              >
                                Editar
                              </button>
                              <button
                                className={`${styles.statusBtn} ${item.activo ? styles.statusInactive : styles.statusActive}`}
                                onClick={() => handleToggleStatus(item)}
                              >
                                {item.activo ? 'Desactivar' : 'Activar'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
