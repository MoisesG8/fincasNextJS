// /app/layout.tsx
"use client"
import './globals.css';
import React, { useState, useEffect } from "react";
//import { AuthProvider } from '../context/AuthContext';
import { AuthContextV2 } from '@/context/AuthContextV2';
import Login from './pages/login/page';
import Dashboard from './pages/dashboard/page';

import { eliminarCookie, getCookie, isTokenValid, setCookie } from './services/funciones';


export default function RootLayout({ children }: { children: React.ReactNode }) {

  const [acceso, setAcceso] = useState(false);
  const [user, setUser] = useState(false);
  
  useEffect(() => {
    //setCookie("auth","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",1)
     const galletaAuth = getCookie('auth')
     const galletaUser = getCookie('user')
     if(galletaAuth!=null){
      //verificar el token
      const esValida= isTokenValid(galletaAuth)
      if(esValida){
        setAcceso(true)
        setUser(JSON.parse(galletaUser))
      }else{
        setAcceso(false)
        eliminarCookie("auth")
        eliminarCookie("user")
      }
     }else{
      //sin acceso
      setAcceso(false)
     }
  }, [])

  
  return (
    <html lang="en">
      <body>
        <AuthContextV2.Provider value={{ acceso, setAcceso, user, setUser }} >
          {
            acceso ? <Dashboard /> : <Login />
          }
        </AuthContextV2.Provider>
      </body>
    </html>
  );
}