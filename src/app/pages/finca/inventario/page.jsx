'use client';

import { useState,useEffect } from 'react';
import styles from './finca.inventario.module.css';
import { useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { myFetch, myFetchGET } from '../../../services/funcionesService';
import React from 'react';

export default function CultivoManager() {
  // Estado para el formulario de cultivo
  const [inventario, setInventario] = useState({
    inventarioId: 0,
    producto: '',
    cantidad: 0,
    unidad: '',
    finca_id: 0
  });
  const [inventarios, setInventarios] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('farmId');


  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInventario((prev) => ({ ...prev, [name]: value }));
  };


  const agregarInventario = async () => {
    const farmId = searchParams.get('farmId');
    inventario.finca_id = farmId ? parseInt(farmId, 10) : 0;
    if (!validarObjeto(inventario)) {
      Swal.fire({
        icon: 'error',
        title: 'Registro',
        text: 'Todos los campos son obligatorios',
        confirmButtonColor: '#db320e',
      });
      return
    }
    const respuesta = await myFetch("https://backnextjs-main-production.up.railway.app/api/v1/addInventario", "POST", inventario)
    if (respuesta?.estado == "exito") {
      Swal.fire({
        icon: 'success',
        title: 'Registro',
        text: 'Inventario registrado correctamente.',
        confirmButtonColor: '#db320e',
      });
      obtenerInventarioXFinca();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Registro',
        text: 'Error al registrar el inventario',
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
  const obtenerInventarioXFinca= async()=>{
    const respuesta = await myFetchGET("https://backnextjs-main-production.up.railway.app/api/v1/getInventarioXFinca/"+id)
    console.log("Respuesta:", respuesta)
    setInventarios(respuesta)
  }
  const confirmarEliminarInventario = (id) => {
    Swal.fire({
      title: 'Eliminar',
      text: 'Desea eliminar el inventario?',
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


  const handleDelete = async(id) => {
    console.log("ID a eliminar:", id);
    const respuesta = await myFetch("https://backnextjs-main-production.up.railway.app/api/v1/deleteInventario/" + id, "DELETE", {})
    if (respuesta?.estado == "exito") {
      Swal.fire({
        icon: 'success',
        title: 'Eliminar',
        text: 'El registro ha sido eliminado exitosamente',
        confirmButtonColor: '#6b4226',
      });
      obtenerInventarioXFinca();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Eliminar',
        text: 'El registro no fue eliminado',
        confirmButtonColor: '#6b4226',
      });
    }
  };
  useEffect(() => {
    obtenerInventarioXFinca();
  },[])
  return (
    <div className={styles.container}>
      <h2>{isEditing ? 'Editar Producto' : 'Registrar Inventario'}</h2>
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label>producto:</label>
          <input
            type="text"
            name="producto"
            value={inventario.producto}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>cantidad:</label>
          <input
            type="number"
            name="cantidad"
            value={inventario.cantidad}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Unidad:</label>
          <select
            name="unidad"
            value={inventario.unidad}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione</option>
            <option value="q">q</option>
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </div>
        <button className={styles.button} onClick={() => { agregarInventario() }}>
          {isEditing ? 'Guardar' : 'Registrar'}
        </button>
      </div>

      <h3>Inventario</h3>
      <ul className={styles.list}>
        {inventarios.map((c) => (
          <li key={c.inventarioId}>
            <strong>{c.producto}</strong> ({c.cantidad}) - {' '}
            {c.unidad}
            <div className={styles.actions}>
              <button onClick={() => confirmarEliminarInventario(c.inventarioId)} className={styles.deleteButton}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}