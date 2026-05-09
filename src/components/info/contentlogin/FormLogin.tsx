import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ContentLogin.module.css';
import { loginUser, loginStaff, type AuthError } from '../../../services/authService';

interface GestanteLoginState {
  codigo_gmi: string;
  respuesta_seguridad: string;
}

interface StaffLoginState {
  email: string;
  password: string;
}

export const FormLogin = () => {
  const navigate = useNavigate();

  const [isStaff, setIsStaff] = useState(false);
  const [gestanteForm, setGestanteForm] = useState<GestanteLoginState>({
    codigo_gmi: '',
    respuesta_seguridad: '',
  });
  const [staffForm, setStaffForm] = useState<StaffLoginState>({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGestanteForm = (key: keyof GestanteLoginState, valor: string) => {
    setGestanteForm((prev) => ({ ...prev, [key]: valor }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleStaffForm = (key: keyof StaffLoginState, valor: string) => {
    setStaffForm((prev) => ({ ...prev, [key]: valor }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isStaff) {
        if (!staffForm.email.trim() || !staffForm.password.trim()) {
          setErrorMessage('Por favor, completa todos los campos.');
          setIsLoading(false);
          return;
        }
        await loginStaff(staffForm);
        navigate('/admin');
      } else {
        if (!gestanteForm.codigo_gmi.trim() || !gestanteForm.respuesta_seguridad.trim()) {
          setErrorMessage('Por favor, completa todos los campos.');
          setIsLoading(false);
          return;
        }
        await loginUser(gestanteForm);
        navigate('/main');
      }
    } catch (error) {
      const authError = error as AuthError;
      if (authError?.status === 401 || authError?.status === 403) {
        setErrorMessage('Credenciales incorrectas. Intenta de nuevo.');
      } else if (authError?.status === 422) {
        setErrorMessage('Formato de datos incorrecto.');
      } else if (authError?.message) {
        setErrorMessage(authError.message);
      } else {
        setErrorMessage('Error de conexión. Verifica que el servidor esté activo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formulario}>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '10px' }}>
        <button
          type="button"
          style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #CA436E', background: !isStaff ? '#CA436E' : 'transparent', color: !isStaff ? 'white' : '#CA436E', cursor: 'pointer' }}
          onClick={() => { setIsStaff(false); setErrorMessage(null); }}
        >
          Gestante
        </button>
        <button
          type="button"
          style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #CA436E', background: isStaff ? '#CA436E' : 'transparent', color: isStaff ? 'white' : '#CA436E', cursor: 'pointer' }}
          onClick={() => { setIsStaff(true); setErrorMessage(null); }}
        >
          Personal Médico
        </button>
      </div>

      {!isStaff ? (
        <>
          <p>Código GMI</p>
          <input
            value={gestanteForm.codigo_gmi}
            type="text"
            placeholder="Ej. GMI-12345"
            disabled={isLoading}
            onChange={(e) => handleGestanteForm('codigo_gmi', e.target.value)}
          />

          <p>Respuesta de Seguridad</p>
          <input
            value={gestanteForm.respuesta_seguridad}
            type="password"
            placeholder="Tu respuesta secreta"
            disabled={isLoading}
            onChange={(e) => handleGestanteForm('respuesta_seguridad', e.target.value)}
          />
        </>
      ) : (
        <>
          <p>Correo Electrónico</p>
          <input
            value={staffForm.email}
            type="email"
            placeholder="correo@ejemplo.com"
            disabled={isLoading}
            onChange={(e) => handleStaffForm('email', e.target.value)}
          />

          <p>Contraseña</p>
          <input
            value={staffForm.password}
            type="password"
            placeholder="Tu contraseña"
            disabled={isLoading}
            onChange={(e) => handleStaffForm('password', e.target.value)}
          />
        </>
      )}

      {errorMessage && (
        <p className={styles.errorMessage || 'error-message'} role="alert" style={{ color: 'red' }}>
          {errorMessage}
        </p>
      )}

      {!isStaff && (
        <p className={styles.confirm}>
          ¿Aún no tienes cuenta?
          <button
            type="button"
            className={styles.register}
            onClick={() => navigate('/register')}
            disabled={isLoading}
          >
            Registrar
          </button>
        </p>
      )}

      <div className={styles.boton}>
        <button
          type="submit"
          className={styles.lastbutton}
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
      </div>
    </form>
  );
};
