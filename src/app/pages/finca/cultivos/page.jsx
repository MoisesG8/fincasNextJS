'use client';

import { useState,useEffect } from 'react';
import styles from './finca.cultivos.module.css';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { myFetch, myFetchGET } from '../../../services/funcionesService';

export default function CultivoManager() {
  const router = useRouter();
  const [cultivo, setCultivo] = useState({
    finca_id: 0,
    variedad: '',
    estado: '',
    fecha: ''
  });

  const searchParams = useSearchParams();
  const id = searchParams.get('farmId');

  const [cultivos, setCultivos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setCultivo((prev) => ({ ...prev, [name]: value }));
  };


  const handleDelete = async(id) => {
    const respuesta = await myFetch("https://backnextjs-main-production.up.railway.app/api/v1/deleteCultivo/" + id, "DELETE", {})
    if (respuesta?.estado == "exito") {
      Swal.fire({
        icon: 'success',
        title: 'Eliminar',
        text: 'El registro ha sido eliminado exitosamente',
        confirmButtonColor: '#6b4226',
      });
      obtenerCultivosXFinca();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Eliminar',
        text: 'El registro no fue eliminado',
        confirmButtonColor: '#6b4226',
      });
    }
  };

  const agregarCultivo = async() => {
    cultivo.finca_id = searchParams.get('farmId');
    if (!validarObjeto(cultivo)) {
      Swal.fire({
        icon: 'error',
        title: 'Registro',
        text: 'Todos los campos son obligatorios',
        confirmButtonColor: '#db320e',
      });
      return
    }
    const respuesta = await myFetch("https://backnextjs-main-production.up.railway.app/api/v1/addCultivo", "POST", cultivo)
    if (respuesta?.estado == "exito") {
      Swal.fire({
        icon: 'success',
        title: 'Registro',
        text: 'Cultivo registrado correctamente.',
        confirmButtonColor: '#db320e',
      });
      obtenerCultivosXFinca();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Registro',
        text: 'Error al registrar el cultivo',
        confirmButtonColor: '#db320e',
      });
      return
    }
  }

  const validarObjeto = (obj) => {
    
    for (const key in obj) {
      if (obj[key] === "") {
        return false; // Devuelve false si se encuentra un campo vacío
      }
    }
    return true; // Devuelve true si todos los campos están llenos
  };

  useEffect(() => {
    obtenerCultivosXFinca();
  },[])

  const confirmarEliminarCultivo = (id) => {
    Swal.fire({
      title: 'Eliminar',
      text: 'Desea eliminar el cultivo?',
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

  const obtenerCultivosXFinca= async()=>{
    const respuesta = await myFetchGET("https://backnextjs-main-production.up.railway.app/api/v1/getCultivosXFinca/"+id)
    setCultivos(respuesta)
    
  }
  return (
    <div className={styles.container}>
      <h2>{isEditing ? 'Editar Cultivo' : 'Registrar Cultivo'}</h2>
      <div className={styles.form}>
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
        {
          /*
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
          */
        }
        <div className={styles.inputGroup}>
          <label>fecha siembra:</label>
          <input
            type="date"
            name="fecha"
            onChange={handleChange}
            required
          />
        </div>
        {
          /*
            <div className={styles.inputGroup}>
              <label>fecha cosecha:</label>
              <input
                type="date"
                name="fechaCosecha"
                onChange={handleChange}
                required
              />
            </div>
            */
        }
        <button className={styles.button} onClick={() => { agregarCultivo() }}>
          {isEditing ? 'Guardar' : 'Registrar'}
        </button>
      </div>

      <h3>Lista de Cultivos</h3>
      <ul className={styles.list}>
        {cultivos.map((c) => (
          <li key={c.cultivoId}>
            <strong>{c.variedad}</strong> ({c.estado}) - {' '}
             fecha siembra: {c.fechaSiembra} 
            <div className={styles.actions}>
              <button onClick={() => confirmarEliminarCultivo(c.cultivoId)} className={styles.deleteButton}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}