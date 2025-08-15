// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, validateToken } = useAuth();

  // Verifica el token una vez (no durante el render)
  useEffect(() => {
    if (typeof validateToken === "function") validateToken();
  }, [validateToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-6">
            {/* anillo spinner */}
            <div className="absolute inset-0 h-16 w-16 rounded-full border-2 border-brand-border border-t-brand-accent animate-spin" />
            {/* burbuja con emoji */}
            <div className="relative w-16 h-16 rounded-full bg-brand-accent flex items-center justify-center shadow">
              <span className="text-2xl text-black">🏗️</span>
            </div>
          </div>
          <p className="text-brand-muted">
            Cargando TaskFixer… <span className="inline-block">⚙️</span>
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;




