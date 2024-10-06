'use client';

import { useState } from 'react';
import styles from './finca.cultivos.module.css';
import { useSearchParams } from 'next/navigation';

interface Cultivo {
  id: number;
  variedad: string;
  estado: string;
  fechaSiembra: Date
  produccion: {
    cantidad: number;
    unidad: string;
    fechaCosecha: Date
  };
}

export default function CultivoManager() {
  const [cultivo, setCultivo] = useState<Cultivo>({
    id: 0,
    variedad: '',
    estado: '',
    fechaSiembra: new Date(),
    produccion: {
      cantidad: 0,
      unidad: '',
      fechaCosecha: new Date()
    },
  });

  const searchParams = useSearchParams();
  const id = searchParams.get('farmId'); 
  console.log('idddd '+id)

  
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    
    if (name === 'cantidad' || name === 'unidad'|| name === 'fechaSiembra') {
      if (name === 'fechaSiembra') {
        setCultivo((prev) => ({
          ...prev,
          produccion: { ...prev.produccion, [name]: new Date(value) },
        }));
      }else{
      setCultivo((prev) => ({
        ...prev,
        produccion: { ...prev.produccion, [name]: value },
      }));
    }
    }else  if (name === 'fechaSiembra') {
      setCultivo((prev) => ({ ...prev, [name]: new Date(value) }));
    }else {
      setCultivo((prev) => ({ ...prev, [name]: value }));
    }
  };

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      
      const updatedCultivos = cultivos.map((c) =>
        c.id === cultivo.id ? cultivo : c
      );
      setCultivos(updatedCultivos);
      setIsEditing(false); 
    } else {
      
      setCultivos([...cultivos, { ...cultivo, id: Date.now() }]);
    }

    
    setCultivo({
      id: 0,
      variedad: '',
      estado: '',
      fechaSiembra: new Date(),
      produccion: {
        cantidad: 0,
        unidad: '',
        fechaCosecha: new Date()
      },
    });
  };

  
  const handleEdit = (cultivo: Cultivo) => {
    setCultivo(cultivo);
    setIsEditing(true); 
  };

  
  const handleDelete = (id: number) => {
    const updatedCultivos = cultivos.filter((c) => c.id !== id);
    setCultivos(updatedCultivos);
  };

  return (
    <div className={styles.container}>
      <h2>{isEditing ? 'Editar Cultivo' : 'Registrar Cultivo'}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Variedad:</label>
          <input
            type="text"
            name="variedad"
            value={cultivo.variedad}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Estado:</label>
          <select
            name="estado"
            value={cultivo.estado}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione</option>
            <option value="En crecimiento">En crecimiento</option>
            <option value="Cosechado">Cosechado</option>
            <option value="Sembrado">Sembrado</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label>Producción:</label>
          <input
            type="number"
            name="cantidad"
            value={cultivo.produccion.cantidad}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Unidad:</label>
          <input
            type="text"
            name="unidad"
            value={cultivo.produccion.unidad}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>fecha siembra:</label>
          <input
            type="date"
            name="fechaSiembra"
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>fecha cosecha:</label>
          <input
            type="date"
            name="fechaCosecha"
            onChange={handleChange}
            required
          />
        </div>
        <button className={styles.button} type="submit">
          {isEditing ? 'Guardar' : 'Registrar'}
        </button>
      </form>

      <h3>Lista de Cultivos</h3>
      <ul className={styles.list}>
        {cultivos.map((c) => (
          <li key={c.id}>
            <strong>{c.variedad}</strong> ({c.estado}) - {c.produccion.cantidad}{' '}
            {c.produccion.unidad} fecha siembra: {c.fechaSiembra.toLocaleDateString()} fecha cosecha: {c.produccion.fechaCosecha.toLocaleDateString()}
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