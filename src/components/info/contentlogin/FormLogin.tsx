import { useNavigate } from 'react-router-dom';
import styles from './ContentLogin.module.css';
import { useState } from 'react';
import useLogin from '../../../hooks/auth/useLogin';

interface FormLoginState {
  name: string;
  password: string;
  edad: string;
}

export const FormLogin = () => {
  const navigate = useNavigate();
  const { loading, login } = useLogin();
  const [formLogin, setFormLogin] = useState<FormLoginState>({
    name: '',
    password: '',
    edad: '',
  });

  const handlerForm = (key: keyof FormLoginState, valor: string) => {
    setFormLogin((prevState) => ({
      ...prevState,
      [key]: valor,
    }));
  };

  const onClickIniciarSesion = async () => {
    await login({
      codigo_gmi: '123456',
      respuesta_seguridad: 'hola',
    }).then(() => {
      // alert(`Felicidades ${formLogin.name} te has registrado exitosamente`);
      if (formLogin.name.toLocaleLowerCase() === 'admin') {
        navigate('/admin');
      } else {
        navigate('/main');
      }
    });
  };
  return (
    <form className={styles.formulario}>
      <p>Codigo</p>
      <input
        value={formLogin.name}
        type="text"
        placeholder="Jhon Doe"
        onChange={(e) => handlerForm('name', e.target.value)}
      />
      <p>Contraseña</p>
      <input
        value={formLogin.password}
        type="password"
        onChange={(e) =>
          setFormLogin((prevState) => ({
            ...prevState,
            password: e.target.value,
          }))
        }
      />

      <div className={styles.boton}>
        <button
          type="button"
          disabled={loading}
          onClick={onClickIniciarSesion}
          className={styles.lastbutton}
        >
          Iniciar
        </button>
      </div>
    </form>
  );
};
