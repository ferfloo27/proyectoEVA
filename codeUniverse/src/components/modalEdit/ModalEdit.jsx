// src/components/Modal.js
import React from 'react';
import { useState, useEffect } from 'react';
import './ModalEdit.css';

export const ModalEdit = ({ isVisible, onClose, nombre, descriptionVideo, video }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [videoEdit, setVideoEdit] = useState({})
  const userLocal = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (isVisible) {
      // Establecer los valores iniciales cuando el modal se abre
      setVideoEdit(video)
      setName(video.titulovideo);
      setDescription(video.descripcion);
    }
  }, [isVisible, video]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedVideo = {
      idVideo:videoEdit.idVideo,
      titulovideo: name,
      descripcion: description,
      size:videoEdit.size,
      tipo:videoEdit.tipo,
      url:videoEdit.url,
      usuario_idusuario: userLocal.id // Ajusta esto según la estructura de tu usuario
    }; 

    try {
      const response = await fetch(`http://localhost/api/apiVideos.php?id=${videoEdit.idVideo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedVideo)
      });

      if (response.ok) {
        // Resetea los campos y cierra el modal
        setName('');
        setDescription('');
        console.log('Actualización exitosa');
        onClose(); // Llama a onClose para cerrar el modal
      } else {
        console.error('Error al actualizar el video:', response.statusText);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  const handleCloseModal = () => {
    setName('')
    setDescription('')
    onClose()
  }

  if (!isVisible) return null;

  return (
    <div className="modal-overlay-edit">
      <div className="modal-content-edit">
        <h1>Editar clase: {videoEdit.titulovideo} </h1>
        <form className="" onSubmit={handleSubmit} encType="multipart/form-data">
          <label>
            Nombre:
            <input type="text" name="nombre" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <br />
          <label>
            Descripción:
            <input type="text" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <br />
          <div className='btns-modal-edit'>
            <button type="submit">Guardar Cambios</button>
            <button onClick={handleCloseModal}>Cerrar</button>
          </div>
        </form>

      </div>
    </div>
  );
};
