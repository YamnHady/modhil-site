import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem('admintoken');

  if (!adminToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
