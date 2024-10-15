'use client';

import { useState } from 'react';
import styles from './finca.create.module.css';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { getCookie, myFetch } from '@/app/services/funcionesService';
export default function Finca() {
  const [finca, setFinca] = useState({
    productorId: 0,
    nombre: "",
    ubicacion: "",
    tamanioHectareas: 0,
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFinca({ ...finca, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'Guardado',
      text: 'El registro ha sido guardado exitosamente',
      confirmButtonColor: '#6b4226',
    });

    router.back();
  };

  const guardarFinca = async () => {
    const galletaUser = getCookie('user')
    let id = 0
    if (galletaUser != null) {
      const User = JSON.parse(galletaUser)
      finca.productorId = User.id
    }
    const respuesta = await myFetch("http://localhost:8080/api/v1/addFinca", "POST", finca)
    if (respuesta) {
      if (respuesta?.estado === "exito") {
        Swal.fire({
          icon: 'success',
          title: 'Guardado',
          text: 'El registro ha sido guardado exitosamente',
          confirmButtonColor: '#6b4226',
        });

        router.back();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Guardado',
          text: 'El registro no fue guardado',
          confirmButtonColor: '#6b4226',
        });
      }
    }
  }
  return (
    <div className={styles.container}>
      <h2>Registro de Finca</h2>
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Nombre:</label>
          <input type="text" name="nombre" value={finca.nombre} onChange={handleChange} required />
        </div>
        <div className={styles.inputGroup}>
          <label>Ubicación:</label>
          <input type="text" name="ubicacion" value={finca.ubicacion} onChange={handleChange} required />
        </div>
        <div className={styles.inputGroup}>
          <label>Tamaño (Hectáreas):</label>
          <input type="number" step="0.01" name="tamanioHectareas" value={finca.tamanioHectareas} onChange={handleChange} required />
        </div>
        <button className={styles.button} onClick={() => { guardarFinca() }}>Registrar</button>
      </div>
    </div>
  );
}
