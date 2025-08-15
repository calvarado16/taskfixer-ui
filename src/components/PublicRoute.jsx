// src/components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-6">
            {/* anillo spinner */}
            <div className="absolute inset-0 h-16 w-16 rounded-full border-2 border-brand-border border-t-brand-accent animate-spin" />
            {/* burbuja con emoji */}
            <div className="relative w-16 h-16 rounded-full bg-brand-accent flex items-center justify-center shadow">
              <span className="text-2xl text-black">⏳</span>
            </div>
          </div>
          <p className="text-brand-muted">
            Cargando… <span className="inline-block">🚪</span>
          </p>
        </div>
      </div>
    );
  }

  // Si está autenticado, redirige al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // No autenticado: permite acceder a la ruta pública (login, registro, etc.)
  return children;
};

export default PublicRoute;





