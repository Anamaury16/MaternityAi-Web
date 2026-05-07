import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ContentLogin.module.css';
import { loginUser, type AuthError } from '../../../services/authService';

interface FormLoginState {
  codigo_gmi: string;
  respuesta_seguridad: string;
}

export const FormLogin = () => {
  const navigate = useNavigate();

  const [formLogin, setFormLogin] = useState<FormLoginState>({
    codigo_gmi: '',
    respuesta_seguridad: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlerForm = (key: keyof FormLoginState, valor: string) => {
    setFormLogin((prevState) => ({
      ...prevState,
      [key]: valor,
    }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formLogin.codigo_gmi.trim() || !formLogin.respuesta_seguridad.trim()) {
      setErrorMessage('Por favor, completa todos los campos.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await loginUser({
        codigo_gmi: formLogin.codigo_gmi,
        respuesta_seguridad: formLogin.respuesta_seguridad,
      });

      console.log('Login exitoso. Rol:', data.role);

      // Redirigir según el rol del usuario
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/main');
      }
    } catch (error) {
      const authError = error as AuthError;
      if (authError?.status === 401 || authError?.status === 403) {
        setErrorMessage('Código GMI o respuesta de seguridad incorrectos.');
      } else if (authError?.status === 422) {
        setErrorMessage(
          'Formato de datos incorrecto. Verifica la información ingresada.'
        );
      } else if (authError?.message) {
        setErrorMessage(authError.message);
      } else {
        setErrorMessage(
          'Error de conexión. Verifica que el servidor esté activo.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formulario}>
      <p>Código GMI</p>
      <input
        value={formLogin.codigo_gmi}
        type="text"
        placeholder="Ej. GMI-12345"
        disabled={isLoading}
        onChange={(e) => handlerForm('codigo_gmi', e.target.value)}
      />

      <p>Respuesta de Seguridad</p>
      <input
        value={formLogin.respuesta_seguridad}
        type="password"
        placeholder="Tu respuesta secreta"
        disabled={isLoading}
        onChange={(e) => handlerForm('respuesta_seguridad', e.target.value)}
      />

      {/* Mensaje de error */}
      {errorMessage && (
        <p className={styles.errorMessage || 'error-message'} role="alert">
          {errorMessage}
        </p>
      )}

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

      <div className={styles.boton}>
        <button
          type="submit"
          className={styles.lastbutton}
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando...' : 'Iniciar'}
        </button>
      </div>
    </form>
  );
};
