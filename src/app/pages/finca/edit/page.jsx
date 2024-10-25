'use client';

import { useState, useEffect } from 'react';
import styles from './finca.edit.module.css';
import { useSearchParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { getCookie, myFetch } from '../../../services/funcionesService';
import React from 'react';

export default function Finca() {
  const [finca, setFinca] = useState({
    nombre: '',
    ubicacion: '',
    tamanoHectarea: 0,
    fechaRegistro: '',
  });
  const router = useRouter();

  const searchParams = useSearchParams();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFinca({ ...finca, [name]: value });
  };

  const actualizarFinca = async () => {
    const galletaUser = getCookie('user')
    let id = 0
    if (galletaUser != null) {
      const User = JSON.parse(galletaUser)
      id = User.id
    }
    let objetoPeticion = {
      "fincaId": searchParams.get('farmId'),
      "nombre": finca.nombre,
      "ubicacion": finca.ubicacion,
      "tamanioHectareas": finca.tamanoHectarea,
      "fechaRegistro": "",
      "productorid": id
    }
    const respuesta = await myFetch("https://backnextjs-main-production.up.railway.app/api/v1/editFinca", "POST", objetoPeticion)
    if(respuesta?.estado=="exito"){
      Swal.fire({
        icon: 'success',
        title: 'Actualizar',
        text: 'El registro se actualizo exitosamente',
        confirmButtonColor: '#6b4226',
      });
      router.back();
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Actualizar',
        text: 'El registro no fue actualizado',
        confirmButtonColor: '#6b4226',
      });
    }
  }

  useEffect(() => {
    setFinca({
      nombre: searchParams.get('nombre') || '',
      ubicacion: searchParams.get('ubicacion') || '',
      tamanoHectarea: Number(searchParams.get('tamanioHectareas')) || 0,
      fechaRegistro: '',
    })
  }, [])
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
          <input type="number" name="tamanoHectarea" value={finca.tamanoHectarea} onChange={handleChange} required />
        </div>
        <button className={styles.button} onClick={() => { actualizarFinca() }}>Guardar</button>
      </div>
    </div>
  );
}
