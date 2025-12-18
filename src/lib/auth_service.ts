
interface User {
    token: string;
    username: string;
}

export const authService = {
  // Verifica si el usuario está autenticado consultando al backend
  async checkAuth(): Promise<any> {
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
      return false;
    }
  },

  async validateToken(token: string): Promise<string> {
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
    console.log(data)
    if (!data?.usuario) {
      throw new Error('Invalid auth response');
    }
    
    return data.usuario;
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