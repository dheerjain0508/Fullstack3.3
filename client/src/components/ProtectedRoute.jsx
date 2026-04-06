import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from './common/LoadingSpinner';
const ProtectedRoute = ({ children }) => {
const { user, loading } = useAuth();


//  Wait until auth state is known
if (loading) {
    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
        Checking authentication...
      </div>
    );
}

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
const location = useLocation();

if (!user) {
  return <Navigate to="/login" state={{ from: location }} replace />;
}
//  Not logged in → kick out
if (!user) {
    return <Navigate to="/login" />;
  }

  //  Allowed inside
  return children;
};

export default ProtectedRoute;