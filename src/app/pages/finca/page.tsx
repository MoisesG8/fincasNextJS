// /app/farms/page.tsx
'use client';

import { useEffect, useState } from 'react';
import styles from './finca.module.css';
import { getFarms, deleteFarm } from '../../services/farmService';
import { useRouter } from 'next/navigation';
import { myFetch, myFetchGET } from '@/app/services/funcionesService';
import Swal from 'sweetalert2';
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
    //fetchFarms();
    getFincas();
  }, []);

  const fetchFarms = async () => {
    try {
      const farmData = await getFarms();
      setFarms(farmData);
    } catch (error) {
      console.error('Error al cargar las fincas:', error);
    }
  };

  const handleEdit = (farm: object) => {
    router.push(`finca/edit?farmId=${farm.fincaId}&nombre=${farm.nombre}&ubicacion=${farm.ubicacion}&tamanioHectareas=${farm.tamanioHectareas}`);
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: 'Eliminar',
      text: 'Desea eliminar la finca?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarFinca(id)
      }
    });
  };

  const eliminarFinca = async (id: number) => {
    const respuesta = await myFetch("http://localhost:8080/api/v1/deleteFinca/" + id, "DELETE", {})
    if (respuesta?.estado == "exito") {
      Swal.fire({
        icon: 'success',
        title: 'Eliminar',
        text: 'El registro ha sido eliminado exitosamente',
        confirmButtonColor: '#6b4226',
      });
      getFincas()
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Eliminar',
        text: 'El registro no fue eliminado',
        confirmButtonColor: '#6b4226',
      });
    }
  }

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



  const getFincas = async () => {
    const res: Farm[] = await myFetchGET("http://localhost:8080/api/v1/getAllFincas")
    if (res) {
      setFarms(res)
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 style={{ color: "#FFFFFF" }}>Listado de Fincas</h1>
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
              <tr key={farm.fincaId}>
                <td>{farm.nombre}</td>
                <td>{farm.ubicacion}</td>
                <td>{farm.tamanioHectareas}</td>
                <td className={styles.actions}>
                  <button className={styles.editButton} onClick={() => handleEdit(farm)}>Editar</button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(farm.fincaId)}>Eliminar</button>
                  <button className={styles.viewButton} onClick={() => handleViewCultivo(farm.fincaId)}>Cultivos</button>
                  <button className={styles.viewButton} onClick={() => handleViewInventarios(farm.fincaId)}>Inventario</button>
                  <button className={styles.viewButton} onClick={() => handleViewPlanificaciones(farm.fincaId)}>Planificaciones</button>
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