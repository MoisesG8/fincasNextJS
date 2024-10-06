'use client';

import { useState } from 'react';
import styles from './finca.edit.module.css';
import { useSearchParams,useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function Finca() {
  const [finca, setFinca] = useState({
    nombre: '',
    ubicacion: '',
    tamanoHectarea: 0,
    fechaRegistro: '',
  });
  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get('farmId'); 

  console.log(id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFinca({ ...finca, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'Guardado',
      text: 'El registro ha sido guardado exitosamente',
      confirmButtonColor: '#6b4226',
    });

    router.back();

  };

  return (
    <div className={styles.container}>
      <h2>Registro de Finca</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
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
        <button className={styles.button} type="submit">Guardar</button>
      </form>
    </div>
  );
}
