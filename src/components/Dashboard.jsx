// src/components/Dashboard.jsx
import { useAuth } from "../context/AuthContext";
import Layout from "./Layout";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="card-dark p-8 text-center">
        <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-black">🏗️</span>
        </div>

        <h2 className="text-2xl font-semibold text-slate-100">
          TaskFixer — Panel
        </h2>
        <p className="mt-1 text-slate-400">
          {user?.firstname || user?.name
            ? `Hola, ${user.firstname ?? user.name}!`
            : "Bienvenido/a"}
        </p>

        <div className="mt-6 text-slate-300">
          <p className="mb-1">
            Selecciona una opción del menú superior para comenzar.
          </p>
          <p className="text-slate-400">
            Usa la navegación para acceder a los módulos disponibles.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;




