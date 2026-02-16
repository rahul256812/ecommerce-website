import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, roles }) {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) return <LoadingSpinner />;
    if (!isAuthenticated) return <Navigate to="/" replace />;
    if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;

    return children;
}
