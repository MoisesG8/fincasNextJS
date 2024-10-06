'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Register.module.css';
import { register } from '../../services/authService';
import { useAuth } from '../../../context/AuthContext';

export default function Register() {
    const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    user: '',
    email: '',
    password: '',
    location: '',
    contact: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //await register(formData);
      login(formData);
      router.push('dashboard'); 
    } catch (error) {
      setErrorMessage('Error al registrar. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <h1 className={styles.h1}>Registro de Productor</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nombre</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="lastname">Apellido</label>
            <input type="text" id="lastname" name="lastname" value={formData.lastname} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="user">Usuario</label>
            <input type="text" id="user" name="user" value={formData.user} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="location">Ubicación</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="contact">Contacto</label>
            <input type="text" id="contact" name="contact" value={formData.contact} onChange={handleChange} required />
          </div>
          {errorMessage && <div className={styles.error}>{errorMessage}</div>}
          <button type="submit" className={styles.registerButton}>Registrar</button>
        </form>
      </div>
    </div>
  );
}