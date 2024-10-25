'use client';

import { useState, useEffect, Suspense } from 'react';
import styles from './finca.edit.module.css';
import { useSearchParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { getCookie, myFetch } from '../../../services/funcionesService';

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
    const galletaUser = getCookie('user');
    let id = 0;
    if (galletaUser != null) {
      const User = JSON.parse(galletaUser);
      id = User.id;
    }
    let objetoPeticion = {
      "fincaId": searchParams.get('farmId'),
      "nombre": finca.nombre,
      "ubicacion": finca.ubicacion,
      "tamanioHectareas": finca.tamanoHectarea,
      "fechaRegistro": "",
      "productorid": id
    };

    // Validar si todos los campos están completos
    if (!finca.nombre || !finca.ubicacion || finca.tamanoHectarea <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Registro',
        text: 'Todos los campos son obligatorios y el tamaño debe ser mayor a 0',
        confirmButtonColor: '#db320e',
      });
      return;
    }

    const respuesta = await myFetch("https://backnextjs-main-production.up.railway.app/api/v1/editFinca", "POST", objetoPeticion);
    if (respuesta?.estado === "exito") {
      Swal.fire({
        icon: 'success',
        title: 'Actualizar',
        text: 'El registro se actualizó exitosamente',
        confirmButtonColor: '#6b4226',
      });
      router.back();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Actualizar',
        text: 'El registro no fue actualizado',
        confirmButtonColor: '#6b4226',
      });
    }
  };

  useEffect(() => {
    const nombre = searchParams.get('nombre');
    const ubicacion = searchParams.get('ubicacion');
    const tamanioHectareas = Number(searchParams.get('tamanioHectareas')) || 0;

    setFinca({
      nombre: nombre || '',
      ubicacion: ubicacion || '',
      tamanoHectarea: tamanioHectareas,
      fechaRegistro: '',
    });
  }, [searchParams]); // Agrega searchParams como dependencia

  return (
    <Suspense fallback = {<div>Cargando...</div>}>
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
        <button className={styles.button} onClick={actualizarFinca}>Guardar</button>
      </div>
    </div>
    </Suspense>
  );
}
