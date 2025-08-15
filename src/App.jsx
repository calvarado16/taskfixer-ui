import "./App.css";

import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import Dashboard from "./components/Dashboard";
import LoginScreen from "./components/LoginScreen";
import SignupScreen from "./components/SignupScreen";

// Pantallas CRUD
import ProfessionsList from "./components/ProfessionsList";
import ServiceOfferingsList from "./components/ServiceOfferingsList";

// Forzar a que la base de la URL sea "/" cuando se usa HashRouter
if (typeof window !== "undefined" && window.location.pathname !== "/") {
  window.history.replaceState(null, "", "/");
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Ruta por defecto que redirige al login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Públicas */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginScreen />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignupScreen />
                </PublicRoute>
              }
            />

            {/* Protegidas */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Profesiones */}
            <Route
              path="/professions"
              element={
                <ProtectedRoute>
                  <ProfessionsList />
                </ProtectedRoute>
              }
            />

            {/* Servicios (Service Offering) */}
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <ServiceOfferingsList />
                </ProtectedRoute>
              }
            />

            {/* Cualquier otra ruta -> login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


