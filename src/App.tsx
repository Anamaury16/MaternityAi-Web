import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { UsPage } from './pages/UsPage';
import { Login } from './pages/Login';
import { UserProfile } from './pages/UserProfile';
import { Biliboteca } from './pages/Biblioteca';
import { Actividad } from './pages/Actividad';
import { Ai } from './pages/Ai';
import { Main } from './pages/Main';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/nosotros" element={<UsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/biblioteca" element={<Biliboteca />} />
          <Route path="/actividad" element={<Actividad />} />
          <Route path="/ai" element={<Ai />} />
          <Route path="/main" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
