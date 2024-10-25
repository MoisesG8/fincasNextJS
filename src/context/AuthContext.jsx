// src/context/AuthContext.tsx
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';


// Crea el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState;

  const login = async (email, password) => {
    const response = await fetch('https://backnextjs-main-production.up.railway.app/api/auth/login', {
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
