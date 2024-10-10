'use client';

import Link from 'next/link';
import styles from './dashboard.module.css';
import { useAuth } from '../../../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  // Verifica si los datos del usuario están llegando correctamente
  console.log('Usuario autenticado:', user);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Bienvenido, {user?.nombre}</h1>
        <p>Administre de forma eficiente sus fincas</p>
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
