import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  //  Not logged in → kick out
  if (!user) {
    return <Navigate to="/login" />;
  }

  //  Allowed inside
  return children;
};

export default ProtectedRoute;