import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, validatePassword, getPasswordStrength } from "../utils/validators";

const SignupScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSignup = async () => {
    if (isSubmitting) return;

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (!formData.name.trim()) { setError("El nombre es requerido"); setIsSubmitting(false); return; }
    if (!formData.lastname.trim()) { setError("El apellido es requerido"); setIsSubmitting(false); return; }
    if (!formData.email.trim()) { setError("El email es requerido"); setIsSubmitting(false); return; }
    if (!isValidEmail(formData.email)) { setError("Por favor ingresa un email válido"); setIsSubmitting(false); return; }

    const pwd = validatePassword(formData.password);
    if (!pwd.isValid) { setError(pwd.message); setIsSubmitting(false); return; }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsSubmitting(false);
      return;
    }

    try {
      const ok = await register(formData.name, formData.lastname, formData.email, formData.password);
      if (ok) {
        setSuccess("¡Cuenta creada exitosamente! Redirigiendo al login…");
        setFormData({ name: "", lastname: "", email: "", password: "", confirmPassword: "" });
        navigate("/login", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Error al crear la cuenta. Intenta nuevamente.");
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
            <span className="text-2xl text-black">🛠️</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">TaskFixer</h1>
          <p className="text-slate-400">Crear cuenta nueva</p>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-900/40 border border-red-500/50 text-red-200">
            <div className="flex items-center">
              <span className="mr-2">❌</span>
              <span>{error}</span>
            </div>
            {(error.includes("email ya está registrado") || error.includes("usuario ya existe")) && (
              <div className="mt-2 text-sm">
                <Link to="/login" className="text-amber-400 hover:text-amber-300 underline">
                  ¿Ya tienes cuenta? Inicia sesión aquí
                </Link>
              </div>
            )}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-md bg-emerald-900/40 border border-emerald-500/50 text-emerald-200">
            <div className="flex items-center">
              <span className="mr-2">✅</span>
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-200 mb-1">Nombre</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Juan"
                required
              />
            </div>
            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-slate-200 mb-1">Apellido</label>
              <input
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Pérez"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="usuario2@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-1">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="8-64 caracteres, 1 mayúscula, 1 número, 1 especial"
              required
            />

            {/* Indicador de fortaleza */}
            {formData.password && (
              <div className="mt-2">
                <div className="text-xs text-slate-400 mb-1">Requisitos de contraseña:</div>
                <div className="space-y-1">
                  {(() => {
                    const s = getPasswordStrength(formData.password);
                    return (
                      <>
                        <div className={`text-xs flex items-center ${s.isValidLength ? "text-emerald-400" : "text-slate-500"}`}>
                          <span className="mr-1">{s.isValidLength ? "✓" : "○"}</span> 8-64 caracteres
                        </div>
                        <div className={`text-xs flex items-center ${s.hasUppercase ? "text-emerald-400" : "text-slate-500"}`}>
                          <span className="mr-1">{s.hasUppercase ? "✓" : "○"}</span> Al menos una mayúscula
                        </div>
                        <div className={`text-xs flex items-center ${s.hasNumber ? "text-emerald-400" : "text-slate-500"}`}>
                          <span className="mr-1">{s.hasNumber ? "✓" : "○"}</span> Al menos un número
                        </div>
                        <div className={`text-xs flex items-center ${s.hasSpecialChar ? "text-emerald-400" : "text-slate-500"}`}>
                          <span className="mr-1">{s.hasSpecialChar ? "✓" : "○"}</span> Carácter especial (@$!%*?&)
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200 mb-1">Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Confirma tu contraseña"
              required
              onKeyDown={(e) => { if (e.key === "Enter") handleSignup(); }}
            />
          </div>

          <button
            type="button"
            onClick={handleSignup}
            disabled={isSubmitting}
            className="w-full py-2 px-4 rounded-md font-medium bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creando cuenta..." : "Crear Cuenta 🏗️"}
          </button>
        </form>

        {/* Link de login */}
        <p className="text-center text-sm text-slate-400 mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-amber-400 hover:text-amber-300">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupScreen;


