export async function login(email: string, password: string) {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  export async function register(userData: any) {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error('Error al registrar el productor');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }