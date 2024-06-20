import { Header } from "../header/Header";
import { useState } from "react";
import { useAuth } from "../../hooks/AuthProvider/AuthProvider";
import axios from 'axios'
import './PanelAgregarVideo.css'

export function PanelAgregarVideo() {
  
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const userLocal = JSON.parse(localStorage.getItem('user'));


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  const subirVideo = async (idVideo) => {
    if (userLocal) {
      const updatedVideosSubidos = [...userLocal.videosSubidos];
      const isVideoAlreadySubscribed = updatedVideosSubidos.some(video => video.idVideo === idVideo);
      if (!isVideoAlreadySubscribed) {
        updatedVideosSubidos.push({ idVideo, inscritos: [] });
      }

      const updatedUser = {
        ...userLocal,
        videosSubidos: updatedVideosSubidos
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));

      
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Por favor, selecciona un archivo");
      return;
    }

    const formData = new FormData();
    formData.append('fichero', file);
    formData.append('nombre', name);
    formData.append('description', description);
    formData.append('usuario_idusuario', userLocal.id);

    try {
      const response = await axios.post('http://localhost/api/apiVideos.php', formData);
      if (response.data) {
        console.log("Archivo subido exitosamente:", response.data);
        subirVideo(response.data.video.idVideo)
        // Opcional: Limpiar el formulario o redirigir al usuario
      } else {
        console.error("Error al subir el archivo:", response.data.message);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="contenedor-form-upload-video">
        <form className="form-upload-video" onSubmit={handleSubmit} encType="multipart/form-data">
          <label>
            Seleccione archivo:
            <input type="file" name="fichero" onChange={handleFileChange} />
          </label>
          <br />
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
          <button type="submit">Subir archivo</button>
        </form>

        
      </div>
    </>
  )
}