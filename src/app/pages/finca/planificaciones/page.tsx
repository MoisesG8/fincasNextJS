'use client';

import { useState } from 'react';
import styles from './finca.planificaciones.module.css';
import { useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

interface Planificacion {
  id: number;
  actividad: string;
  fechaInicio: Date;
  fechaFin: Date;
  estado: string;
}

interface Seguimiento {
  id: number;
  planificacionId: number;
  fecha: Date;
  actividadRealizada: string;
  observaciones: string;
}

export default function PlanificacionesManager() {
  const [planificacion, setPlanificacion] = useState<Planificacion>({
    id: 0,
    actividad: '',
    fechaInicio: new Date(),
    fechaFin: new Date(),
    estado: ''
  });

  const [planificaciones, setPlanificaciones] = useState<Planificacion[]>([]);
  const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const [newSeguimiento, setNewSeguimiento] = useState<Seguimiento>({
    id: 0,
    planificacionId: 0,
    fecha: new Date(),
    actividadRealizada: '',
    observaciones: ''
  });

  const searchParams = useSearchParams();
  const id = searchParams.get('farmId');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'fechaInicio' || name === 'fechaFin') {
      setPlanificacion((prev) => ({ ...prev, [name]: new Date(value) }));
    } else if (name === 'fecha') {
      setNewSeguimiento((prev) => ({ ...prev, [name]: new Date(value) }));
    } else if (['actividadRealizada', 'observaciones'].includes(name)) {
      setNewSeguimiento((prev) => ({ ...prev, [name]: value }));
    } else {
      setPlanificacion((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitPlanificacion = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      const updatedPlanificacion = planificaciones.map((c) =>
        c.id === planificacion.id ? planificacion : c
      );
      setPlanificaciones(updatedPlanificacion);
      setIsEditing(false);
      Swal.fire({
        icon: 'success',
        title: 'Guardado',
        text: 'El registro ha sido guardado exitosamente',
        confirmButtonColor: '#6b4226',
      });
    } else {
      setPlanificaciones([...planificaciones, { ...planificacion, id: Date.now() }]);
      Swal.fire({
        icon: 'success',
        title: 'Guardado',
        text: 'El registro ha sido guardado exitosamente',
        confirmButtonColor: '#6b4226',
      });
    }
    setPlanificacion({
      id: 0,
      actividad: '',
      fechaInicio: new Date(),
      fechaFin: new Date(),
      estado: ''
    });
  };

  const handleEditPlanificacion = (planificacion: Planificacion) => {
    setPlanificacion(planificacion);
    setNewSeguimiento((prev) => ({ ...prev, planificacionId: planificacion.id })); // Asegurarse de que el seguimiento tenga el planificacionId
    setIsEditing(true);
  };

  const handleDeletePlanificacion = (id: number) => {
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
        const updatedPlanificaciones = planificaciones.filter((c) => c.id !== id);
        setPlanificaciones(updatedPlanificaciones);
      }
    });
  };

  const handleAddSeguimiento = (e: React.FormEvent) => {
    e.preventDefault();

    // Asociar el seguimiento con la planificación actual
    const updatedSeguimiento = {
      ...newSeguimiento,
      id: Date.now(),
      planificacionId: planificacion.id,
    };

    setSeguimientos([...seguimientos, updatedSeguimiento]);

    Swal.fire({
      icon: 'success',
      title: 'Seguimiento agregado',
      text: 'El seguimiento ha sido agregado exitosamente',
      confirmButtonColor: '#6b4226',
    });

    setNewSeguimiento({
      id: 0,
      planificacionId: planificacion.id,
      fecha: new Date(),
      actividadRealizada: '',
      observaciones: ''
    });
  };

  return (
    <div className={styles.container}>
      <h2>{isEditing ? 'Editar Planificacion' : 'Registrar Planificacion'}</h2>
      <form onSubmit={handleSubmitPlanificacion} className={styles.form}>
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
            name="fechaInicio"
            value={planificacion.fechaInicio.toISOString().substring(0, 10)}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Fecha Fin:</label>
          <input
            type="date"
            name="fechaFin"
            value={planificacion.fechaFin.toISOString().substring(0, 10)}
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
        <button className={styles.button} type="submit">
          {isEditing ? 'Guardar' : 'Registrar'}
        </button>
      </form>

      <h3>Planificaciones</h3>
      <ul className={styles.list}>
        {planificaciones.map((c) => (
          <li key={c.id}>
            <strong>{c.actividad}</strong> ({c.fechaInicio.toLocaleDateString()} - {c.fechaFin.toLocaleDateString()}) {c.estado}
            <div className={styles.actions}>
              <button onClick={() => handleEditPlanificacion(c)} className={styles.editButton}>
                Editar
              </button>
              <button onClick={() => handleDeletePlanificacion(c.id)} className={styles.deleteButton}>
                Eliminar
              </button>
            </div>

            <h4>Seguimientos</h4>
            <ul>
              {seguimientos.filter((s) => s.planificacionId === c.id).map((s) => (
                <li key={s.id}>
                  {s.fecha.toLocaleDateString()}: {s.actividadRealizada} ({s.observaciones})
                </li>
              ))}
            </ul>

            <form onSubmit={handleAddSeguimiento}>
              <div className={styles.inputGroup}>
                <label>Fecha Seguimiento:</label>
                <input
                  type="date"
                  name="fecha"
                  value={newSeguimiento.fecha.toISOString().substring(0, 10)}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Actividad Realizada:</label>
                <input
                  type="text"
                  name="actividadRealizada"
                  value={newSeguimiento.actividadRealizada}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Observaciones:</label>
                <input
                  type="text"
                  name="observaciones"
                  value={newSeguimiento.observaciones}
                  onChange={handleChange}
                  required
                />
              </div>
              <button className={styles.button} type="submit">
                Agregar Seguimiento
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}