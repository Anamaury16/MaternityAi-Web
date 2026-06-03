import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ContentLogin.module.css';
import { loginUser, loginStaff, getSecurityQuestion, type AuthError, requestPasswordReset, confirmPasswordReset } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';

// Mapa rol → ruta de destino
const ROLE_HOME: Record<string, string> = {
  gestante: '/main',
  admin: '/admin',
  clinico: '/clinico',
  investigador: '/investigador',
};

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
  const location = useLocation();
  const { login } = useAuth();

  const [isStaff, setIsStaff] = useState(location.state?.isStaff || false);
  // ─── Reset de contraseña ─────────────────────────────────────────────────────
  const [showReset, setShowReset] = useState(false);
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [isLoadingReset, setIsLoadingReset] = useState(false);

  const handleResetRequest = async () => {
    if (!resetEmail.trim()) {
      setErrorMessage('Ingresa tu correo electrónico.');
      return;
    }
    setIsLoadingReset(true);
    setErrorMessage(null);
    try {
      await requestPasswordReset({ email: resetEmail });
      setSuccessMessage('Si el email existe, recibirás instrucciones en tu correo.');
      setResetStep(2);
    } catch {
      setErrorMessage('No se pudo procesar la solicitud. Intenta de nuevo.');
    } finally {
      setIsLoadingReset(false);
    }
  };

  const handleResetConfirm = async () => {
    if (!resetToken.trim() || !resetNewPassword.trim()) {
      setErrorMessage('Completa el token y la nueva contraseña.');
      return;
    }
    setIsLoadingReset(true);
    setErrorMessage(null);
    try {
      await confirmPasswordReset({ token: resetToken, new_password: resetNewPassword });
      setSuccessMessage('¡Contraseña actualizada! Ya puedes iniciar sesión.');
      setShowReset(false);
      setResetStep(1);
      setResetEmail('');
      setResetToken('');
      setResetNewPassword('');
    } catch {
      setErrorMessage('Token inválido o expirado. Solicita uno nuevo.');
    } finally {
      setIsLoadingReset(false);
    }
  };
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
        const staffData = await loginStaff(staffForm);
        login(staffData); // actualiza el AuthContext
        localStorage.setItem('user_name', staffForm.email);
        setSuccessMessage('Sesión iniciada correctamente.');
        // Redirige al dashboard correspondiente al rol
        const from = location.state?.from?.pathname;
        navigate(from || ROLE_HOME[staffData.role] || '/admin', { replace: true });
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
        const gestanteData = await loginUser(gestanteForm);
        login(gestanteData); // actualiza el AuthContext
        localStorage.setItem('user_name', `Gestante ${gestanteForm.codigo_gmi}`);
        setSuccessMessage('Sesión iniciada correctamente.');
        navigate('/main', { replace: true });
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

      <div className={styles.hideOnMobile} style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '10px' }}>
        <button
          type="button"
          style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #CA436E', background: !isStaff ? '#CA436E' : 'transparent', color: !isStaff ? 'white' : '#CA436E', cursor: 'pointer', transition: 'all 0.3s ease' }}
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
          style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #CA436E', background: isStaff ? '#CA436E' : 'transparent', color: isStaff ? 'white' : '#CA436E', cursor: 'pointer', transition: 'all 0.3s ease' }}
          onClick={() => {
            setIsStaff(true);
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
        >
          Staff / Médico
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
                placeholder="Ej. ID-GMI-2024-001"
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
      {/* ── Reset de contraseña (solo visible en modo staff) ── */}
      {isStaff && !showReset && (
        <button
          type="button"
          onClick={() => { setShowReset(true); setErrorMessage(null); setSuccessMessage(null); }}
          style={{
            background: 'none', border: 'none', color: '#CA436E',
            cursor: 'pointer', marginTop: '12px', textDecoration: 'underline',
            fontSize: '0.85rem', display: 'block', width: '100%', textAlign: 'center',
          }}
        >
          ¿Olvidaste tu contraseña?
        </button>
      )}

      {isStaff && showReset && (
        <div style={{
          marginTop: '16px', padding: '16px', borderRadius: '10px',
          border: '1px solid #f0c0cc', background: '#fff8f9',
        }}>
          <p style={{ fontWeight: '600', color: '#CA436E', marginBottom: '12px', fontSize: '0.95rem' }}>
            {resetStep === 1 ? '🔑 Restablecer contraseña' : '✅ Confirmar nueva contraseña'}
          </p>

          {resetStep === 1 && (
            <>
              <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '8px' }}>
                Ingresa tu correo y te enviaremos un token de recuperación.
              </p>
              <input
                type="email"
                placeholder="correo@hospital.com"
                value={resetEmail}
                onChange={(e) => { setResetEmail(e.target.value); setErrorMessage(null); }}
                disabled={isLoadingReset}
                style={{
                  width: '100%', padding: '10px', borderRadius: '8px',
                  border: '1px solid #ddd', marginBottom: '10px',
                  fontSize: '0.9rem', boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={handleResetRequest}
                disabled={isLoadingReset}
                style={{
                  width: '100%', padding: '10px', borderRadius: '8px',
                  background: '#CA436E', color: 'white', border: 'none',
                  cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
                }}
              >
                {isLoadingReset ? 'Enviando...' : 'Enviar token'}
              </button>
            </>
          )}

          {resetStep === 2 && (
            <>
              <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '8px' }}>
                Revisa tu correo e ingresa el token recibido junto a tu nueva contraseña.
              </p>
              <input
                type="text"
                placeholder="Token recibido por email"
                value={resetToken}
                onChange={(e) => { setResetToken(e.target.value); setErrorMessage(null); }}
                disabled={isLoadingReset}
                style={{
                  width: '100%', padding: '10px', borderRadius: '8px',
                  border: '1px solid #ddd', marginBottom: '10px',
                  fontSize: '0.9rem', boxSizing: 'border-box',
                }}
              />
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={resetNewPassword}
                onChange={(e) => { setResetNewPassword(e.target.value); setErrorMessage(null); }}
                disabled={isLoadingReset}
                style={{
                  width: '100%', padding: '10px', borderRadius: '8px',
                  border: '1px solid #ddd', marginBottom: '10px',
                  fontSize: '0.9rem', boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={handleResetConfirm}
                disabled={isLoadingReset}
                style={{
                  width: '100%', padding: '10px', borderRadius: '8px',
                  background: '#CA436E', color: 'white', border: 'none',
                  cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
                }}
              >
                {isLoadingReset ? 'Confirmando...' : 'Confirmar nueva contraseña'}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => { setShowReset(false); setResetStep(1); setResetEmail(''); setResetToken(''); setResetNewPassword(''); setErrorMessage(null); setSuccessMessage(null); }}
            style={{
              background: 'none', border: 'none', color: '#999',
              cursor: 'pointer', marginTop: '10px', fontSize: '0.8rem',
              textDecoration: 'underline', display: 'block', width: '100%', textAlign: 'center',
            }}
          >
            Cancelar
          </button>
        </div>
      )}
    </form>
  );
};
