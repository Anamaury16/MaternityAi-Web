import { useNavigate } from 'react-router-dom';
import styles from './ContentLogin.module.css';
import { useState } from 'react';

interface FormLoginState {
  name: string;
  password: string;
  edad: string;
}

export const FormLogin = () => {
  const navigate = useNavigate();
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

  const onClickIniciarSesion = () => {
    alert(`Felicidades ${formLogin.name} te has registrado exitosamente`);
    if (formLogin.name.toLocaleLowerCase() === 'admin') {
      navigate('/admin');
    } else {
      navigate('/main');
    }
  };
  return (
    <form onSubmit={onClickIniciarSesion} className={styles.formulario}>
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
          type="submit"
          // onClick={onClickIniciarSesion}
          className={styles.lastbutton}
        >
          Iniciar
        </button>
      </div>
    </form>
  );
};
