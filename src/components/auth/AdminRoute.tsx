import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const AdminRoute = () => {
  const { user, isAuthenticated, initialized } = useAuthStore();

  if (!initialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
