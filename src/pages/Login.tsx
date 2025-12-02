import { useState, useEffect } from 'react';
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth_context';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RETURN_URL } from '@/components/predfined';

export default function AuthPanel() {
  const { username, isAuthenticated, login } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validar acceso del usuario
  const validateAccess = async () => {
    try {
      let token = params.get('token');
     
      if (!token) {
        const allParams = Array.from(params.entries());
        if (allParams.length > 0) {
          // Tomar el primer parámetro disponible
          token = allParams[0][1] || allParams[0][0];
        }
      }

      if (!token) {
        setError('No se ha proporcionado un token de acceso');
        setLoading(false);
        return;
      }

      // Intentar login con el token
      await login(token);
      
      // Si llegamos aquí, el login fue exitoso
      setSuccess('¡Acceso autorizado! Bienvenido al sistema.');
      setError('');
      setLoading(false);

    } catch (err) {
      console.error('Error al validar acceso:', err);
      setError('Tu sesión ha expirado o se ha cerrado inesperadamente, por favor, vuelve a iniciar sesión para continuar');
      setSuccess('');
      setLoading(false);
    }
  };

  // Ejecutar validación al montar el componente
  useEffect(() => {
    validateAccess();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // Redirigir al usuario a la página principal después de un breve retraso
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleVolver = () => {
    window.location.href = RETURN_URL;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Panel de Acceso
          </h1>
          <p className="text-gray-600 text-sm">
            Sistema de validación de usuarios
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Validando credenciales...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-red-800 mb-1">
                  Acceso Denegado
                </h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && !loading && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-green-800 mb-1">
                  Acceso Autorizado
                </h3>
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {username && !isAuthenticated && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Información del Usuario
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Usuario:</span> {username}</p>
            </div>
          </div>
        )}

        {!loading && (
          <button
            onClick={handleVolver}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio
          </button>
        )}
      </div>
    </div>
  );
}