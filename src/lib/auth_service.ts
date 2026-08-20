import { Modo } from "@/components/chat/types";

// Respuesta de /login/status y /login/validate_token
export interface AuthStatus {
    status?: string;
    logged_in?: boolean;
    usuario: string;
    modos?: Modo[];
    roles?: unknown[];
}

export const authService = {
  // Verifica si el usuario está autenticado consultando al backend
  async checkAuth(): Promise<AuthStatus> {
    try {
      const response = await fetch('/api/login/status', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      throw error;
    }
  },

  async validateToken(token: string): Promise<AuthStatus> {
    const response = await fetch('/api/login/validate_token', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error(`Auth failed (${response.status}): ${response.statusText} `);
    }

    const data = await response.json();
    if (!data?.usuario) {
      throw new Error('Invalid auth response');
    }

    return data;
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/login/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error en logout:', error);
    }
  }
};

export default authService;