// /app/farms/page.tsx
'use client';

import { useEffect, useState } from 'react';
import styles from './finca.module.css';
import { getFarms, deleteFarm } from '../../services/farmService';
import { useRouter } from 'next/navigation';

interface Farm {
  id: number;
  nombre: string;
  ubicacion: string;
  tamanioHectareas: number;
  cultivo: string;
}

export default function FarmList() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const farmsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const farmData = await getFarms();
      setFarms(farmData);
    } catch (error) {
      console.error('Error al cargar las fincas:', error);
    }
  };

  const handleEdit = (farmId: number) => {
    router.push(`finca/edit?farmId=${farmId}`);
  };

  const handleDelete = async (id: number) => {
    try {
      if (confirm('¿Está seguro de que desea eliminar esta finca?')) {
        await deleteFarm(id);
        fetchFarms();
      }
    } catch (error) {
      console.error('Error al eliminar la finca:', error);
    }
  };

  const handleViewCultivo = (farmId: number) => {
    router.push(`finca/cultivos?farmId=${farmId}`);
  };

  const handleViewInventarios = (farmId: number) => {
    router.push(`finca/inventario?farmId=${farmId}`);
  };

  const handleViewPlanificaciones = (farmId: number) => {
    router.push(`finca/planificaciones?farmId=${farmId}`);
  };

  const handleAddFarm = () => {
    router.push('finca/create'); 
  };

  const indexOfLastFarm = currentPage * farmsPerPage;
  const indexOfFirstFarm = indexOfLastFarm - farmsPerPage;
  const currentFarms = farms.slice(indexOfFirstFarm, indexOfLastFarm);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Listado de Fincas</h1>
        <button className={styles.addButton} onClick={handleAddFarm}>Agregar Finca</button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Tamaño (Hectáreas)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentFarms.length > 0 ? (
            currentFarms.map((farm) => (
              <tr key={farm.id}>
                <td>{farm.nombre}</td>
                <td>{farm.ubicacion}</td>
                <td>{farm.tamanioHectareas}</td>
                <td className={styles.actions}>
                  <button className={styles.editButton} onClick={() => handleEdit(farm.id)}>Editar</button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(farm.id)}>Eliminar</button>
                  <button className={styles.viewButton} onClick={() => handleViewCultivo(farm.id)}>Cultivos</button>
                  <button className={styles.viewButton} onClick={() => handleViewInventarios(farm.id)}>Inventario</button>
                  <button className={styles.viewButton} onClick={() => handleViewPlanificaciones(farm.id)}>Planificaciones</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No hay fincas registradas</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={styles.pagination}>
        {Array.from({ length: Math.ceil(farms.length / farmsPerPage) }).map((_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}