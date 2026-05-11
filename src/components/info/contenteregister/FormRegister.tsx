import { useNavigate } from 'react-router-dom';
import styles from './RegisterContent.module.css';
import { useState } from 'react';
import { registerGestante } from '../../../services/m0Service';
import type { GestanteRegisterRequest } from '../../../services/m0Service';

export const FormRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<GestanteRegisterRequest>({
    fecha_nacimiento: '',
    fecha_ultima_menstruacion: '',
    anio_ingreso: new Date().getFullYear(),
    pregunta_seguridad: '¿Cuál es el nombre de tu primera mascota?',
    respuesta_seguridad: '',
  });

  const handleChange = (key: keyof GestanteRegisterRequest, value: string | number) => {
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
      alert(`${response.mensaje}. Tu código GMI es: ${response.codigo_gmi}`);
      // Guardamos el código GMI para el login posterior si es necesario
      localStorage.setItem('temp_gmi', response.codigo_gmi);
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Error al registrar. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.formulario} onSubmit={handleSubmit}>
      <h3 className={styles.formTitle}>Registro de Gestante</h3>
      
      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.inputGroup}>
        <p>Fecha de Nacimiento</p>
        <input
          required
          value={formData.fecha_nacimiento}
          type="date"
          onChange={(e) => handleChange('fecha_nacimiento', e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <p>Fecha de Última Menstruación (FUM)</p>
        <input
          required
          value={formData.fecha_ultima_menstruacion}
          type="date"
          onChange={(e) => handleChange('fecha_ultima_menstruacion', e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <p>Pregunta de Seguridad</p>
        <select 
          className={styles.selectInput}
          value={formData.pregunta_seguridad}
          onChange={(e) => handleChange('pregunta_seguridad', e.target.value)}
        >
          <option value="¿Cuál es el nombre de tu primera mascota?">¿Cuál es el nombre de tu primera mascota?</option>
          <option value="¿Cuál es el nombre de tu ciudad natal?">¿Cuál es el nombre de tu ciudad natal?</option>
          <option value="¿Cuál es tu color favorito?">¿Cuál es tu color favorito?</option>
        </select>
      </div>

      <div className={styles.inputGroup}>
        <p>Respuesta de Seguridad</p>
        <input
          required
          value={formData.respuesta_seguridad}
          type="text"
          placeholder="Tu respuesta"
          onChange={(e) => handleChange('respuesta_seguridad', e.target.value)}
        />
      </div>

      <p className={styles.confirm}>
        ¿Ya tienes cuenta? 
        <button
          type="button"
          className={styles.iniciar}
          onClick={() => navigate('/login')}
        >
          Iniciar Sesión
        </button>
      </p>

      <div className={styles.boton}>
        <button
          type="submit"
          disabled={loading}
          className={styles.register}
        >
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </div>
    </form>
  );
};
