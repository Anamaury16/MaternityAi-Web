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

  const MostrarData = () => {
    alert(`Felicidades ${formLogin.name} te has registrado exitosamente`);
  };
  return (
    <form onSubmit={MostrarData} className={styles.formulario}>
      <p>Usuario</p>
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

      <p className={styles.confirm}>
        Aún no tienes cuenta ?
        <button
          type="button"
          className={styles.register}
          onClick={() => navigate('/register')}
        >
          Registrar
        </button>
      </p>
      <div className={styles.boton}>
        <button
          type="button"
          onClick={() => {
            MostrarData();
            navigate('/main');
          }}
          className={styles.lastbutton}
        >
          Iniciar
        </button>
      </div>
    </form>
  );
};
