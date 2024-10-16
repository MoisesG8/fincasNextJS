'use client';

import { useState,useEffect } from 'react';
import styles from './finca.planificaciones.module.css';
import { useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import { myFetch, myFetchGET } from '@/app/services/funcionesService';
import { useRouter } from 'next/navigation';
interface Planificacion {
  finca_id: any;
  actividad: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  estado: string;
}
/*
interface Seguimiento {
  id: number;
  planificacionId: number;
  fecha: Date;
  actividadRealizada: string;
  observaciones: string;
}*/

export default function PlanificacionesManager() {
  const router = useRouter();
  const [planificacion, setPlanificacion] = useState<Planificacion>({
    finca_id: 0,
    actividad: '',
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    estado: ''
  });

  const [planificaciones, setPlanificaciones] = useState<Planificacion[]>([]);

  const [isEditing, setIsEditing] = useState(false);
/*
  const [newSeguimiento, setNewSeguimiento] = useState<Seguimiento>({
    id: 0,
    planificacionId: 0,
    fecha: new Date(),
    actividadRealizada: '',
    observaciones: ''
  });
*/
  const searchParams = useSearchParams();
  const id = searchParams.get('farmId');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPlanificacion((prev) => ({ ...prev, [name]: value }));
  };


  const confirmarEliminarCultivo = (id:number) => {
    Swal.fire({
      title: 'Eliminar',
      text: 'Desea eliminar la planificacion?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id)
      }
    });
  }
  const handleDelete = async(id: number) => {
    const respuesta = await myFetch("http://localhost:8080/api/v1/deletePlanificacion/" + id, "DELETE", {})
    if (respuesta?.estado == "exito") {
      Swal.fire({
        icon: 'success',
        title: 'Eliminar',
        text: 'El registro ha sido eliminado exitosamente',
        confirmButtonColor: '#6b4226',
      });
      obtenerPlanificacionXFinca();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Eliminar',
        text: 'El registro no fue eliminado',
        confirmButtonColor: '#6b4226',
      });
    }
  };

  const validarObjeto = (obj) => {
    for (const key in obj) {
      if (obj[key] === "") {
        return false; // Devuelve false si se encuentra un campo vacío
      }
    }
    return true; // Devuelve true si todos los campos están llenos
  };

  const agregarPlanificacion = async() => {
    planificacion.finca_id = searchParams.get('farmId');
    if (!validarObjeto(planificacion)) {
      Swal.fire({
        icon: 'error',
        title: 'Registro',
        text: 'Todos los campos son obligatorios',
        confirmButtonColor: '#db320e',
      });
      return
    }
    const respuesta = await myFetch("http://localhost:8080/api/v1/addPlanificacion", "POST", planificacion)
    if (respuesta?.estado == "exito") {
      Swal.fire({
        icon: 'success',
        title: 'Registro',
        text: 'Planificacion registrada correctamente.',
        confirmButtonColor: '#db320e',
      });
      router.back();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Registro',
        text: 'Error al registrar la planificacion',
        confirmButtonColor: '#db320e',
      });
      return
    }
  }

  const obtenerPlanificacionXFinca= async()=>{
    const respuesta = await myFetchGET("http://localhost:8080/api/v1/getPlanificacionXFinca/"+id)
    setPlanificaciones(respuesta)
  }

  useEffect(() => {
    obtenerPlanificacionXFinca();
  },[])
  return (
    <div className={styles.container}>
      <h2>{isEditing ? 'Editar Planificacion' : 'Registrar Planificacion'}</h2>
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Actividad:</label>
          <input
            type="text"
            name="actividad"
            value={planificacion.actividad}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Fecha Inicio:</label>
          <input
            type="date"
            name="fecha_inicio"
            value={planificacion.fecha_inicio}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Fecha Fin:</label>
          <input
            type="date"
            name="fecha_fin"
            value={planificacion.fecha_fin}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Estado:</label>
          <input
            type="text"
            name="estado"
            value={planificacion.estado}
            onChange={handleChange}
            required
          />
        </div>
        <button className={styles.button} onClick={()=>{agregarPlanificacion()}}>
          {isEditing ? 'Guardar' : 'Registrar'}
        </button>
      </div>

      <h3>Planificaciones</h3>
      <ul className={styles.list}>
        {planificaciones.map((c) => (
          <li key={c.planificacionId}>
            <strong>{c.actividad}</strong> ({c.fechaInicio} - {c.fechaFin}) {c.estado}
            <div className={styles.actions}>
              <button onClick={() => confirmarEliminarCultivo(c.planificacionId)} className={styles.deleteButton}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}