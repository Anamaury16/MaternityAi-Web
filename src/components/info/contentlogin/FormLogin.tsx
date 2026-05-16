import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ContentLogin.module.css';
import { loginUser, loginStaff, getSecurityQuestion, type AuthError } from '../../../services/authService';

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
  
  // Estados para Gestante
  const [gestanteStep, setGestanteStep] = useState<1 | 2>(1);
  const [securityQuestion, setSecurityQuestion] = useState<string>('');
  
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGestanteForm = (key: keyof GestanteLoginState, valor: string) => {
    setGestanteForm((prev) => ({ ...prev, [key]: valor }));
    if (errorMessage) setErrorMessage(null);
    if (successMessage) setSuccessMessage(null);
  };

  const handleStaffForm = (key: keyof StaffLoginState, valor: string) => {
    setStaffForm((prev) => ({ ...prev, [key]: valor }));
    if (errorMessage) setErrorMessage(null);
    if (successMessage) setSuccessMessage(null);
  };

  const handleNextStep = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!gestanteForm.codigo_gmi.trim()) {
      setErrorMessage('Por favor, ingresa tu Código GMI.');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      const res = await getSecurityQuestion(gestanteForm.codigo_gmi);
      setSecurityQuestion(res.pregunta);
      setSuccessMessage('Código validado correctamente. Responde la pregunta para continuar.');
      setGestanteStep(2);
    } catch (error) {
      const authError = error as AuthError;
      setErrorMessage(authError?.message || 'Código GMI no encontrado o error de servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (isStaff) {
        if (!staffForm.email.trim() || !staffForm.password.trim()) {
          setErrorMessage('Por favor, completa todos los campos.');
          setIsLoading(false);
          return;
        }
        await loginStaff(staffForm);
        setSuccessMessage('Sesión iniciada correctamente.');
        navigate('/admin');
      } else {
        if (gestanteStep === 1) {
          // Fallback por si dan enter en el input en el paso 1
          await handleNextStep(e as any);
          return;
        }

        if (!gestanteForm.codigo_gmi.trim() || !gestanteForm.respuesta_seguridad.trim()) {
          setErrorMessage('Por favor, completa tu respuesta.');
          setIsLoading(false);
          return;
        }
        await loginUser(gestanteForm);
        setSuccessMessage('Sesión iniciada correctamente.');
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
          onClick={() => { 
            setIsStaff(false); 
            setErrorMessage(null); 
            setSuccessMessage(null);
          }}
        >
          Gestante
        </button>
        <button
          type="button"
          style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #CA436E', background: isStaff ? '#CA436E' : 'transparent', color: isStaff ? 'white' : '#CA436E', cursor: 'pointer' }}
          onClick={() => { 
            setIsStaff(true); 
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
        >
          Personal Médico
        </button>
      </div>

      {!isStaff ? (
        <>
          {gestanteStep === 1 && (
            <>
              <p>Código GMI</p>
              <input
                value={gestanteForm.codigo_gmi}
                type="text"
                placeholder="Ej. GMI-12345"
                disabled={isLoading}
                onChange={(e) => handleGestanteForm('codigo_gmi', e.target.value)}
              />
            </>
          )}

          {gestanteStep === 2 && (
            <>
              <p>Pregunta de Seguridad</p>
              <div style={{ padding: '12px', background: '#fef5f8', borderRadius: '8px', borderLeft: '4px solid #CA436E', marginBottom: '15px', color: '#CA436E', fontWeight: '500' }}>
                {securityQuestion}
              </div>
              
              <input
                value={gestanteForm.respuesta_seguridad}
                type="password"
                placeholder="Tu respuesta secreta"
                disabled={isLoading}
                onChange={(e) => handleGestanteForm('respuesta_seguridad', e.target.value)}
              />

              <button 
                type="button" 
                onClick={() => {
                  setGestanteStep(1);
                  setGestanteForm(prev => ({ ...prev, respuesta_seguridad: '' }));
                  setSuccessMessage(null);
                  setErrorMessage(null);
                }}
                style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginTop: '10px', textDecoration: 'underline', fontSize: '0.9rem' }}
              >
                Volver y corregir código
              </button>
            </>
          )}
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

      {successMessage && (
        <p className={styles.successMessage || 'success-message'} role="alert" style={{ color: '#2e7d32', backgroundColor: '#edf7ed', padding: '10px', borderRadius: '5px', marginTop: '15px', fontSize: '0.9rem', border: '1px solid #c8e6c9' }}>
          {successMessage}
        </p>
      )}

      {errorMessage && (
        <p className={styles.errorMessage || 'error-message'} role="alert" style={{ color: '#d32f2f', backgroundColor: '#fdeded', padding: '10px', borderRadius: '5px', marginTop: '15px', fontSize: '0.9rem', border: '1px solid #ef5350' }}>
          {errorMessage}
        </p>
      )}

      {/* Registro oculto del login público según requerimiento */}

      <div className={styles.boton}>
        {(!isStaff && gestanteStep === 1) ? (
          <button
            type="button"
            className={styles.lastbutton}
            disabled={isLoading}
            onClick={handleNextStep}
          >
            {isLoading ? 'Verificando...' : 'Continuar'}
          </button>
        ) : (
          <button
            type="submit"
            className={styles.lastbutton}
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        )}
      </div>
    </form>
  );
};
