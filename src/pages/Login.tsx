import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Headers/HeaderHome/Header';
import { ContentLogin } from '../components/info/contentlogin/ContentLogin';
import { isAuthenticated, getRole } from '../services/authService';

export const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      const role = getRole();
      if (role === 'admin' || role === 'clinico' || role === 'investigador') {
        navigate('/admin');
      } else {
        navigate('/main');
      }
    }
  }, [navigate]);

  return (
    <div>
      <Header />
      <ContentLogin />
    </div>
  );
};
