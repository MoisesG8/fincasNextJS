// src/context/AuthContext.tsx
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define la interfaz User
interface User {
  id: number;
  nombre: string;
  apellido: string;
  usuario: string;
  email: string;
  contacto: string;
  ubicacion: string;
}

// Define la interfaz para el contexto de autenticación
interface AuthContextType {
  user: User | null; // El usuario puede ser null si no hay sesión
  login: (email: string, password: string) => Promise<void>; // Función para iniciar sesión
  logout: () => void; // Función para cerrar sesión
}

// Crea el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Error de autenticación');
    }

    console.log('response', response.json());
    
    console.log('response', response);
    const data = await response.json();
    setUser(data.productorResponse); // Asigna el productorResponse al estado
    localStorage.setItem('user', JSON.stringify(data.productorResponse)); // Almacena el usuario en localStorage
  };

  const logout = () => {
    setUser(null); // Restablece el usuario al cerrar sesión
    localStorage.removeItem('user'); // Elimina el usuario del localStorage
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // Carga el usuario desde localStorage si existe
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
