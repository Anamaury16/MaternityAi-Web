import { useState, useEffect } from 'react';
import { HeaderActividad } from '../../components/Headers/HeaderActividad/HeaderActividad';
import styles from '../../components/admin/AdminCargas.module.css';
import { 
  uploadExcel, 
  getHistorialCargas, 
  getDetalleCarga,
  type CargaExcelResponse,
  type CargaExcelDetalleResponse
} from '../../services/adminService';

export const AdminCargas = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cargas, setCargas] = useState<CargaExcelResponse[]>([]);
  const [selectedCarga, setSelectedCarga] = useState<CargaExcelDetalleResponse | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchCargas = async () => {
    try {
      const data = await getHistorialCargas();
      setCargas(data);
    } catch (err) {
      console.error('Error fetching historial cargas:', err);
    }
  };

  useEffect(() => {
    fetchCargas();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setErrorMsg(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setErrorMsg(null);
    try {
      await uploadExcel(file);
      setFile(null);
      // Reset input file (uncontrolled)
      const fileInput = document.getElementById('excel-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      await fetchCargas();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al subir el archivo');
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

  return (
    <div className={styles.root}>
      <HeaderActividad rol="medico" tabActivo="Cargas" />

      <div className={styles.grid}>
        
        {/* Panel Izquierdo: Subir Excel e Historial */}
        <div className={`${styles.panel} ${styles.panelLeft}`}>
          <h2 className={styles.panelTitle}>Carga Masiva</h2>
          
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
            <button 
              className={styles.uploadBtn}
              onClick={handleUpload}
              disabled={!file || isUploading}
            >
              {isUploading ? 'Procesando archivo...' : 'Cargar Excel'}
            </button>
          </div>

          <h2 className={styles.panelTitle}>Historial</h2>
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

              {selectedCarga.detalles && selectedCarga.detalles.length > 0 && (
                <>
                  <h3 className={styles.errorsTitle}>Registro de Problemas</h3>
                  <div className={styles.errorList}>
                    {selectedCarga.detalles.map((detalle, idx) => (
                      <div key={idx} className={styles.errorItem}>
                        <div className={styles.errorLocation}>
                          {detalle.hoja} - Fila {detalle.fila_numero}
                        </div>
                        <div className={detalle.estado === 'error' ? styles.errorMessage : ''}>
                          {detalle.mensaje_error || detalle.estado}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>Selecciona una carga del historial para ver sus detalles</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
