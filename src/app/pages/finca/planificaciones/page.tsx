'use client';

import { useState, useEffect } from 'react';
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

export default function PlanificacionesManager() {
  const router = useRouter();

  const [actividad, setActividad] = useState('');
  const [fecha, setFecha] = useState('');
  const [observacion, setObservacion] = useState('');
  const [planificacion, setPlanificacion] = useState<Planificacion>({
    finca_id: 0,
    actividad: '',
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    estado: ''
  });

  const [planificaciones, setPlanificaciones] = useState<Planificacion[]>([]);

  const [isEditing, setIsEditing] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get('farmId');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPlanificacion((prev) => ({ ...prev, [name]: value }));
  };



  const confirmarEliminarCultivo = (id: number) => {
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

  const abrirModalAgregarSeguimiento = (item: any) => {
    Swal.fire({
      title: 'Agregar Seguimiento',
      html: `
          <input type="text" id="actividad" class="swal2-input" placeholder="Actividad" value="${actividad}">
          <input type="date" id="fecha" class="swal2-input" placeholder="Fecha" value="${fecha}">
          <input type="text" id="observacion" class="swal2-input" placeholder="Observacion" value="${observacion}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      customClass: {
        input: 'input-custom',
        popup: 'popup-custom',
        confirmButton: 'btn-aceptar',
        cancelButton: 'btn-cancelar'
      },
      preConfirm: () => {
        const actividad = document.getElementById('actividad').value;
        const fecha = document.getElementById('fecha').value;
        const observacion = document.getElementById('observacion').value;

        if (!actividad || !fecha || !observacion) {
          Swal.showValidationMessage('Por favor, ingresa todos los campos.');
        }
      }

    }).then((result) => {
      if (result.isConfirmed) {

        const actividad = document.getElementById('actividad').value;
        const fecha = document.getElementById('fecha').value;
        const observacion = document.getElementById('observacion').value;
        agregarSeguimiento(actividad, fecha, observacion, item.planificacionId)
      }
    });
  }


  const agregarSeguimiento = async (_actividad: string, _fecha: string, _observacion: string, _planificacionID: number) => {
    let objetoPeticion = {
      planificacion_id: _planificacionID,
      fecha: _fecha,
      actividad_realizada: _actividad,
      observaciones: _observacion
    }

    const respuesta = await myFetch("http://localhost:8080/api/v1/addSeguimiento", "POST", objetoPeticion);
    if (respuesta?.estado === "exito") {
      Swal.fire({
        icon: 'success',
        title: 'Guardado',
        text: 'El registro ha sido guardado exitosamente',
        confirmButtonColor: '#6b4226',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Guardado',
        text: 'El registro no fue guardado',
        confirmButtonColor: '#6b4226',
      });
    }
  };


  const handleDelete = async (id: number) => {
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

  const agregarPlanificacion = async () => {
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
      obtenerPlanificacionXFinca();
      //router.back();
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

  const obtenerPlanificacionXFinca = async () => {
    const respuesta = await myFetchGET("http://localhost:8080/api/v1/getPlanificacionXFinca/" + id)
    setPlanificaciones(respuesta)
  }

  const mostrarPlanificaciones = async (item: any) => {

    const idPlanificacion = item.planificacionId
    Swal.fire({
      icon: 'success',
      title: 'Guardado',
      text: 'El registro ha sido guardado exitosamente',
      confirmButtonColor: '#6b4226',
    });
    const res: any[] = await myFetchGET("http://localhost:8080/api/v1/getSeguimientoXPlanificacion/" + idPlanificacion)
    if (res.length == 0) {
      Swal.fire({
        icon: 'success',
        title: 'Seguimientos',
        text: 'Esta planificacion no tiene seguimientos.',
        confirmButtonColor: '#6b4226',
      });
      return
    }

    let tableHTML = `
  <style>
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 16px;
      text-align: left;
    }
    th, td {
      padding: 12px;
      border: 1px solid #ddd;
    }
    th {
      background-color: #3085d6;
      color: white;
    }
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    tr:hover {
      background-color: #ddd;
    }
  </style>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Actividad</th>
        <th>Fecha</th>
        <th>Observacion</th>
      </tr>
    </thead>
    <tbody>
`;

    res.forEach((row, index) => {
      tableHTML += `<tr><td>${index + 1}</td><td>${row.actividadRealizada}</td><td>${row.fecha}</td><td>${row.observaciones}
      </tr>`;
    });

    tableHTML += '</tbody></table>';

    Swal.fire({
      title: 'Seguimiento de actividades',
      html: tableHTML,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3085d6',
    });
  };
  useEffect(() => {
    obtenerPlanificacionXFinca();
  }, [])
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
        <button className={styles.button} onClick={() => { agregarPlanificacion() }}>
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
              <button onClick={() => abrirModalAgregarSeguimiento(c)} className={styles.editButton}>
                Agregar Seguimiento
              </button>
              <button onClick={() => mostrarPlanificaciones(c)} className={styles.blueButton}>
                Ver Seguimiento
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}