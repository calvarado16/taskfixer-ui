import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isValidEmail } from "../utils/validators";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    if (!email.trim()) {
      setError("El email es requerido");
      setIsSubmitting(false);
      return;
    }
    if (!isValidEmail(email)) {
      setError("Por favor ingresa un email válido");
      setIsSubmitting(false);
      return;
    }
    if (!password.trim()) {
      setError("La contraseña es requerida");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login(email, password);
      if (result) navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Error al iniciar sesión. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <div className="w-full max-w-md rounded-lg shadow-md bg-slate-800 border border-slate-700 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-amber-500">
            <span className="text-2xl text-black">🏗️</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">TaskFixer</h1>
          <p className="text-slate-400">Inicia sesión</p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-900/40 border border-red-500/50 text-red-200">
            <div className="flex items-center">
              <span className="mr-2">❌</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full px-3 py-2 rounded-md border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              required
              className="w-full px-3 py-2 rounded-md border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-2 px-4 rounded-md font-medium bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión 🛠️"}
          </button>
        </form>

        {/* Link de registro */}
        <p className="text-center text-sm text-slate-400 mt-4">
          ¿No tienes cuenta?{" "}
          <Link to="/signup" className="text-amber-400 hover:text-amber-300">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;



