import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole }) {
  const authenticated = sessionStorage.getItem('authenticated');
  const user = sessionStorage.getItem('user');

  if (!authenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole) {
    const userData = JSON.parse(user);
    const roles = userData.authorities?.map(auth => 
      typeof auth === 'string' ? auth : auth.authority
    ) || [];

    const hasRole = roles.some(role => 
      role.includes(requiredRole) || 
      role.includes(requiredRole.toLowerCase()) ||
      role.includes('ROLE_' + requiredRole)
    );

    if (!hasRole) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;