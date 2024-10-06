'use client';

import { useState } from 'react';
import styles from './finca.inventario.module.css';
import { useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

interface Inventario {
  id: number;
  producto: string;
  cantidad: number;
  unidad: string;
}

export default function CultivoManager() {
  // Estado para el formulario de cultivo
  const [cultivo, setInventario] = useState<Inventario>({
    id: 0,
    producto: '',
    cantidad: 0,
    unidad:'',
  });

  const searchParams = useSearchParams();
  const id = searchParams.get('farmId'); 
  console.log('idddd '+id)

  const [inventario, setInventarios] = useState<Inventario[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    
      setInventario((prev) => ({ ...prev, [name]: value }));
    
  };

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
     
      const updatedInventarios = inventario.map((c) =>
        c.id === cultivo.id ? cultivo : c
      );
      setInventarios(updatedInventarios);
      setIsEditing(false); 
      Swal.fire({
        icon: 'success',
        title: 'Guardado',
        text: 'El registro ha sido guardado exitosamente',
        confirmButtonColor: '#6b4226',
      });
    } else {
      
      setInventarios([...inventario, { ...cultivo, id: Date.now() }]);
      Swal.fire({
        icon: 'success',
        title: 'Guardado',
        text: 'El registro ha sido guardado exitosamente',
        confirmButtonColor: '#6b4226',
      });
    }

    setInventario({
      id: 0,
      producto: '',
      cantidad: 0,
      unidad: '',
    });
  };

  
  const handleEdit = (inventario: Inventario) => {
    setInventario(inventario);
    setIsEditing(true); 
  };

  
  const handleDelete = (id: number) => {

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#6b4226',
      confirmButtonText: 'Sí, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCultivos = inventario.filter((c) => c.id !== id);
    setInventarios(updatedCultivos);
      }
    });

    
  };

  return (
    <div className={styles.container}>
      <h2>{isEditing ? 'Editar Producto' : 'Registrar Producto'}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>producto:</label>
          <input
            type="text"
            name="producto"
            value={cultivo.producto}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>cantidad:</label>
          <input
            type="number"
            name="cantidad"
            value={cultivo.cantidad}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Unidad:</label>
          <input
            type="text"
            name="unidad"
            value={cultivo.unidad}
            onChange={handleChange}
            required
          />
        </div>
        <button className={styles.button} type="submit">
          {isEditing ? 'Guardar' : 'Registrar'}
        </button>
      </form>

      <h3>Inventario</h3>
      <ul className={styles.list}>
        {inventario.map((c) => (
          <li key={c.id}>
            <strong>{c.producto}</strong> ({c.cantidad}) - {' '}
            {c.unidad}
            <div className={styles.actions}>
              <button onClick={() => handleEdit(c)} className={styles.editButton}>
                Editar
              </button>
              <button onClick={() => handleDelete(c.id)} className={styles.deleteButton}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}