import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated, getRole } from '../services/authService';

interface ProtectedRouteProps {
  requiredRole?: string;
  redirectPath?: string;
}

export const ProtectedRoute = ({ 
  requiredRole, 
  redirectPath = '/login' 
}: ProtectedRouteProps) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirigir al login si no está autenticado, pasando de dónde venía
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  const userRole = getRole();

  if (requiredRole) {
    const isStaffRole = userRole === 'admin' || userRole === 'clinico' || userRole === 'investigador';
    
    if (requiredRole === 'admin' && !isStaffRole) {
      return <Navigate to="/main" replace />;
    }
    
    if (requiredRole === 'gestante' && userRole !== 'gestante') {
      return <Navigate to="/admin" replace />;
    }
  }

  // Si todo está bien, renderiza los hijos (Outlet)
  return <Outlet />;
};
