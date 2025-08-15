import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, validateToken } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!validateToken()) clearInterval(interval);
    }, 60_000);

    validateToken();
    return () => clearInterval(interval);
  }, [validateToken]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavItem = ({ to, icon, label }) => {
    const isActive =
      location.pathname === to || location.pathname.startsWith(`${to}/`);
    const base =
      "flex items-center gap-2 px-4 py-2 rounded-md transition-colors";
    const active =
      "bg-brand-border/40 text-brand-text";
    const idle =
      "text-brand-muted hover:text-brand-text hover:bg-brand-border/20";

    return (
      <button
        className={`${base} ${isActive ? active : idle}`}
        onClick={() => navigate(to)}
        type="button"
      >
        <span className="mr-1">{icon}</span>
        <span className="font-medium">{label}</span>
      </button>
    );
  };

  const fullName = `${user?.firstname ?? ""} ${user?.lastname ?? ""}`.trim();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      {/* Header */}
      <header className="bg-brand-card border-b border-brand-border shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold">
                ¡Bienvenido a TaskFixer! <span className="inline-block">🧰</span>
              </h1>
              <p className="text-brand-muted">
                {fullName ? `Hola ${fullName}` : "Hola"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              type="button"
              className="bg-brand-accent hover:bg-brand-accentHover text-black/90 font-medium px-4 py-2 rounded-md transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>

          {/* Nav */}
          <nav className="py-3">
            <ul className="flex flex-wrap gap-2">
              <li><NavItem to="/dashboard"   icon="🏠" label="Inicio" /></li>
              <li><NavItem to="/professions" icon="👨‍💼" label="Profesiones" /></li>
              <li><NavItem to="/services"    icon="📋" label="Servicios" /></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

