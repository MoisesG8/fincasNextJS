'use client';

import Link from 'next/link';
import styles from './dashboard.module.css';
import { AuthContextV2 } from '../../../context/AuthContextV2';
import { useContext } from "react";
import { eliminarCookie, myFetchGET, getCookie } from '../../services/funcionesService';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
export default function Dashboard() {
  /*Contexto*/
  const { user, acceso, setAcceso } = useContext(AuthContextV2);
  const router = useRouter();

  const cerrarSesion = () => {
    eliminarCookie("auth")
    eliminarCookie("user")
    setAcceso(false)
  }

  const confirmarCerrarSesion = () => {
    Swal.fire({
      title: 'Cerrar Sesión',
      text: 'Desea cerrar session?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        cerrarSesion()
        router.push('/pages/login')
      }
    });
  }

  /*const handleDownload = async () => {
    try {
      const objetoPeticion =
      {
        "idFinca": 3,
        "idProductor": 2
      }


      const response = await fetch('http://localhost:8080/api/v1/generarExcel', "POST", objetoPeticion); // Cambia esto a la ruta de tu servicio

      console.log(response)
      /* if (!response.ok) {
         throw new Error('Error al descargar el archivo');
       }
 
       const data = await response.arrayBuffer(); // Obtener el archivo como un ArrayBuffer
       const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); // Crear un blob
       const url = window.URL.createObjectURL(blob); // Crear una URL del blob
 
       const a = document.createElement('a'); // Crear un elemento de enlace
       a.href = url;
       a.download = 'archivo.xlsx'; // Nombre del archivo que se descargará
       document.body.appendChild(a); // Agregar el enlace al cuerpo
       a.click(); // Simular el clic en el enlace
       a.remove(); // Eliminar el enlace
       window.URL.revokeObjectURL(url); // Revocar la URL del blob
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
    }
  }*/

    const mostrarModal = async() => {
      const galletaUser = getCookie('user')
      let id = 0
      if (galletaUser != null) {
        const User = JSON.parse(galletaUser)
        
        id = User.id
      }
      const res = await myFetchGET("https://backnextjs-main-production.up.railway.app/api/v1/getFincasDeProductor/"+id)     
      console.log(res) 
     
      // myFetch()
      // Construir el HTML para el combo a partir de la variable opciones
      const comboHTML = `
          <select id="opciones" class="swal2-input">
              <option value="">Selecciona una Finca</option>
              ${res.map(opcion => `<option value="${opcion.fincaId}">${opcion.nombre}</option>`).join('')}
          </select>
      `;
  
      Swal.fire({
          title: 'Selecciona una opción',
          html: comboHTML,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: 'Descargar',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
              const selectedOption = document.getElementById('opciones').value;
              if (!selectedOption) {
                  Swal.showValidationMessage('Por favor, selecciona una opción');
              }
              return selectedOption;
          }
      }).then((result) => {
          if (result.isConfirmed) {
              const idFinca = result.value;
              handleDownload(idFinca,id)
          } else if (result.isDismissed) {
              console.log('Acción cancelada');
          }
      });
  };
  

  const handleDownload = async (idFinca,idProductor) => {
    const data = {
        idFinca:Number(idFinca),
        idProductor: Number(idProductor)
    };

    try {
        const response = await fetch('https://backnextjs-main-production.up.railway.app/api/v1/generarExcel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // Cambia según sea necesario
            },
            body: JSON.stringify(data)
        });

        // Verifica si la respuesta es exitosa
        if (!response.ok) {
          Swal.fire({
            icon: 'error',
            title: 'Descargar Informe',
            text: 'Sin informacion para esta finca',
            confirmButtonColor: '#db320e',
          });
          return
        }

        // Obtener el blob del archivo
        const blob = await response.blob();

        // Crear una URL para el blob
        const url = window.URL.createObjectURL(blob);

        // Crear un enlace y simular un clic para descargar el archivo
        const a = document.createElement('a');
        a.href = url;
        a.download = 'archivo.xlsx'; // Cambia el nombre y la extensión según sea necesario
        document.body.appendChild(a);
        a.click();
        a.remove();

        // Limpiar la URL del blob
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error al descargar el archivo:', error);
    }
}
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Bienvenido, {user?.nombre}</h1>
        <p>Administre de forma eficiente sus fincas</p>
        <button className="btn-cerrar-sesion" onClick={() => { confirmarCerrarSesion() }}>Cerrar sesión</button>
      </div>
      <div className={styles.userInfo}>
        <h2>Información de cuenta</h2>
        <p><strong>Nombre de usuario:</strong> {user?.usuario}</p>
        <p><strong>Ubicación:</strong> {user?.ubicacion}</p>
        <p><strong>Contacto:</strong> {user?.contacto}</p>
      </div>

      <nav className={styles.nav}>
        <ul>
          <li><Link href="finca">🏡 Fincas</Link></li>
          <li><button onClick={() => { mostrarModal() }}>📅 Descargar Informe</button></li>

        </ul>
      </nav>
    </div>
  );
}
