import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">

        <h1 className="text-7xl font-extrabold text-slate-800 tracking-tight mb-2">
          404
        </h1>

        <p className="text-xl font-medium text-slate-700 mb-2">
          Página no encontrada
        </p>

        <p className="text-sm text-slate-500 mb-6">
          La ruta que intentás acceder no existe o fue movida.
        </p>

        <a
          href="/"
          className="
            inline-flex items-center justify-center
            px-6 py-3
            bg-blue-600 hover:bg-blue-700
            text-white text-sm font-semibold
            rounded-lg
            shadow-sm hover:shadow-md
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500/30
          "
        >
          Volver al inicio
        </a>

      </div>
    </div>
  );
};

export default NotFound;
