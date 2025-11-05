import { useNavigate } from 'react-router-dom';
import styles from './RegisterContent.module.css';
import { useState } from 'react';

interface FormRegisterState {
  name: string;
  lastName: string;
  user: string;
  password: string;
  confirm: string;
}

export const FormRegister = () => {
  const navigate = useNavigate();
  const [formRegister, setFormRegister] = useState<FormRegisterState>({
    name: '',
    lastName: '',
    user: '',
    password: '',
    confirm: ' ',
  });

  const handleForm = (key: keyof FormRegisterState, valor: string) => {
    setFormRegister((prevState) => ({
      ...prevState,
      [key]: valor,
    }));
  };

  const ObtenerData = () => {
    alert(`tus datos se han registrado exitosamente `);
  };
  return (
    <form className={styles.formulario}>
      <p>Nombre</p>
      <input
        value={formRegister.name}
        type="text"
        placeholder="Jhon "
        onChange={(e) => handleForm('name', e.target.value)}
      />
      <p>Apellido</p>
      <input
        value={formRegister.lastName}
        type="text"
        placeholder=" Doe"
        onChange={(e) => handleForm('lastName', e.target.value)}
      />
      <p>Usuario</p>
      <input
        value={formRegister.user}
        type="text"
        placeholder="JhonDoe03"
        onChange={(e) => handleForm('user', e.target.value)}
      />

      <p>Contraseña</p>
      <input
        value={formRegister.password}
        type="password"
        onChange={(e) => handleForm('password', e.target.value)}
      />
      <p>Confirma contraseña</p>

      <input
        value={formRegister.confirm}
        type="password"
        onChange={(e) => handleForm('confirm', e.target.value)}
      />
      <p className={styles.confirm}>
        Ya tienes cuenta ?
        <button
          type="button"
          className={styles.iniciar}
          onClick={() => navigate('/login')}
        >
          Iniciar
        </button>
      </p>
      <div className={styles.boton}>
        <button
          type="button"
          onClick={() => {
            ObtenerData();
            navigate('/main');
          }}
          className={styles.register}
        >
          Registrar
        </button>
      </div>
    </form>
  );
};
