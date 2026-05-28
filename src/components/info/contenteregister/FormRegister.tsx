import { useNavigate } from 'react-router-dom';
import modalStyles from '../../../pages/adminPages/StaffModal.module.css';
import { useState, useEffect } from 'react';
import { registerGestante } from '../../../services/m0Service';
import type { GestanteRegisterRequest } from '../../../services/m0Service';
import { getCatalogos } from '../../../services/adminService';
import type { Catalogos } from '../../../services/adminService';
import { CatalogField } from './CatalogField';

export const FormRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [catalogos, setCatalogos] = useState<Catalogos>({
    nacionalidades: [],
    eapbs: [],
    pertenencias_etnicas: [],
    grupos_poblacionales: [],
  });

  const [formData, setFormData] = useState<GestanteRegisterRequest>({
    fecha_nacimiento: '',
    fecha_ultima_menstruacion: '',
    anio_ingreso: new Date().getFullYear(),
    pregunta_seguridad: '¿Cuál es el nombre de tu primera mascota?',
    respuesta_seguridad: '',
  });

  useEffect(() => {
    getCatalogos()
      .then(setCatalogos)
      .catch(() => {
        // Si falla el catálogo, no bloquear el formulario
        console.warn('No se pudieron cargar los catálogos');
      });
  }, []);

  const handleChange = (key: keyof GestanteRegisterRequest, value: string | number | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await registerGestante(formData);
      setSuccess(true);
      // Guardamos el código GMI para el login posterior
      localStorage.setItem('temp_gmi', response.codigo_gmi);
      setTimeout(() => {
        alert(`${response.mensaje}. Tu código GMI es: ${response.codigo_gmi}`);
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Error al registrar. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={modalStyles.form} onSubmit={handleSubmit}>
      {success && (
        <div className={modalStyles.successBanner}>
          ✅ Gestante registrada exitosamente
        </div>
      )}

      {error && (
        <p className={modalStyles.error}>{error}</p>
      )}

      <div className={modalStyles.field}>
        <label className={modalStyles.label}>Fecha de Nacimiento *</label>
        <input
          className={modalStyles.input}
          required
          value={formData.fecha_nacimiento}
          type="date"
          onChange={(e) => handleChange('fecha_nacimiento', e.target.value)}
          disabled={loading}
        />
      </div>

      <div className={modalStyles.field}>
        <label className={modalStyles.label}>Fecha de Última Menstruación (FUM) *</label>
        <input
          className={modalStyles.input}
          required
          value={formData.fecha_ultima_menstruacion}
          type="date"
          onChange={(e) => handleChange('fecha_ultima_menstruacion', e.target.value)}
          disabled={loading}
        />
      </div>

      {/* ── Catálogos con modo libre ── */}
      <CatalogField
        label="Nacionalidad"
        items={catalogos.nacionalidades}
        selectedId={formData.nacionalidad_id}
        textoLibre={formData.nacionalidad_texto ?? ''}
        onSelectId={(id) => handleChange('nacionalidad_id', id)}
        onTextoLibre={(val) => handleChange('nacionalidad_texto', val)}
        disabled={loading}
      />

      <CatalogField
        label="EAPB / EPS"
        items={catalogos.eapbs}
        selectedId={formData.eapb_id}
        textoLibre={formData.eapb_texto ?? ''}
        onSelectId={(id) => handleChange('eapb_id', id)}
        onTextoLibre={(val) => handleChange('eapb_texto', val)}
        disabled={loading}
      />

      <CatalogField
        label="Pertenencia Étnica"
        items={catalogos.pertenencias_etnicas}
        selectedId={formData.pertenencia_etnica_id}
        textoLibre={formData.pertenencia_etnica_texto ?? ''}
        onSelectId={(id) => handleChange('pertenencia_etnica_id', id)}
        onTextoLibre={(val) => handleChange('pertenencia_etnica_texto', val)}
        disabled={loading}
      />

      <CatalogField
        label="Grupo Poblacional"
        items={catalogos.grupos_poblacionales}
        selectedId={formData.grupo_poblacional_id}
        textoLibre={formData.grupo_poblacional_texto ?? ''}
        onSelectId={(id) => handleChange('grupo_poblacional_id', id)}
        onTextoLibre={(val) => handleChange('grupo_poblacional_texto', val)}
        disabled={loading}
      />

      {/* ── Pregunta de seguridad ── */}
      <div className={modalStyles.field}>
        <label className={modalStyles.label}>Pregunta de Seguridad</label>
        <select
          className={modalStyles.select}
          value={formData.pregunta_seguridad}
          onChange={(e) => handleChange('pregunta_seguridad', e.target.value)}
          disabled={loading}
        >
          <option value="¿Cuál es el nombre de tu primera mascota?">¿Cuál es el nombre de tu primera mascota?</option>
          <option value="¿Cuál es el nombre de tu ciudad natal?">¿Cuál es el nombre de tu ciudad natal?</option>
          <option value="¿Cuál es tu color favorito?">¿Cuál es tu color favorito?</option>
        </select>
      </div>

      <div className={modalStyles.field}>
        <label className={modalStyles.label}>Respuesta de Seguridad *</label>
        <input
          className={modalStyles.input}
          required
          value={formData.respuesta_seguridad}
          type="text"
          placeholder="Tu respuesta"
          onChange={(e) => handleChange('respuesta_seguridad', e.target.value)}
          disabled={loading}
        />
      </div>

      <div className={modalStyles.actions}>
        <button
          type="submit"
          className={modalStyles.submitBtn}
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrar Materna'}
        </button>
      </div>
    </form>
  );
};
