'use client';

import Link from 'next/link';
import styles from './dashboard.module.css';
import { AuthContextV2 } from '@/context/AuthContextV2';
import { useContext } from "react";
import { eliminarCookie, setCookie } from '@/app/services/funcionesService';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
export default function Dashboard() {
  /*Contexto*/
  const { user, acceso, setAcceso } = useContext(AuthContextV2);
  const router = useRouter();

  const cerrarSesion = () => {
    eliminarCookie("auth")
    eliminarCookie("user")
    setAcceso(false)
  }

  const confirmarCerrarSesion = () => {
    Swal.fire({
      title: 'Cerrar Sesión',
      text: 'Desea cerrar session?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        cerrarSesion()
        router.push('/pages/login')
      }
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Bienvenido, {user?.nombre}</h1>
        <p>Administre de forma eficiente sus fincas</p>
        <button class="btn-cerrar-sesion" onClick={() => { confirmarCerrarSesion() }}>Cerrar sesión</button>
      </div>
      <div className={styles.userInfo}>
        <h2>Información de cuenta</h2>
        <p><strong>Nombre de usuario:</strong> {user?.usuario}</p>
        <p><strong>Ubicación:</strong> {user?.ubicacion}</p>
        <p><strong>Contacto:</strong> {user?.contacto}</p>
      </div>

      <nav className={styles.nav}>
        <ul>
          <li><Link href="finca">🏡 Fincas</Link></li>
          <li><Link href="pages/informes">📅 Informes</Link></li>
        </ul>
      </nav>
    </div>
  );
}
