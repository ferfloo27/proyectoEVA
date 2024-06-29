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
  const [words, setWords] = useState(['']);

  const handleWordChange = (index, value) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
  };

  const addWord = () => {
    setWords([...words, '']);
  };

  const removeWord = (index) => {
    const newWords = words.filter((_, i) => i !== index);
    setWords(newWords);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
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
    formData.append('words', JSON.stringify(words)); 

    try {
      const response = await axios.post('http://localhost/api/apiVideos.php', formData);
      if (response.data) {
        console.log("Archivo subido exitosamente:", response.data);
        // console.log('idVideo', response.data.video.idVideo)
        subirVideo(response.data)
        // Opcional: Limpiar el formulario o redirigir al usuario
      } else {
        console.error("Error al subir el archivo:", response.data.message);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const subirVideo = async (respuesta) => {
    const videoId = respuesta.video.idVideo
    if (userLocal && videoId) {
      console.log('id',videoId)
      const updatedVideosSubidos = [...userLocal.videosSubidos];
      const isVideoAlreadySubscribed = updatedVideosSubidos.some(video => video.idVideo === videoId);
      if (!isVideoAlreadySubscribed) {
        updatedVideosSubidos.push({ idVideo:videoId, inscritos: [] });
      }

      const updatedUser = {
        ...userLocal,
        videosSubidos: updatedVideosSubidos
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));

      try {
        // Realiza la solicitud PUT
        const response = await fetch('http://localhost/api/api.php', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.message === 'Usuario actualizado') {
            // Opcional: refrescar el usuario del estado local después de guardar en el servidor
            setFile(null)
            setName('')
            setDescription('')
            setWords([''])
          } else {
            console.error('Error al actualizar usuario:', data.error);
          }
        } else {
          console.error('Error en la respuesta de la API:', response.statusText);
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
      }

    }
  };


  return (
    <>
      <Header />
      <div className="secciones">
        <form className="contenedor-form-upload-video" onSubmit={handleSubmit} encType="multipart/form-data">
          <section className="form-upload-video section1">
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
          </section>
          <section className="form-upload-video section2">
            <div className="words-container">
              {words.map((wordEntry, index) => (
                <div key={index} className="word-entry">
                  <label className="palabra">
                    Palabra:
                    <input
                      type="text"
                      value={wordEntry}
                      onChange={(e) => handleWordChange(index, e.target.value)}
                    />
                  </label>
                  {index > 0 && (
                    <button className="btn-delete-word" type="button" onClick={() => removeWord(index)}> X</button>
                  )}
                </div>
              ))}
            </div>
            <div className="btns-words">
            <button className="btn-words" type="button" onClick={addWord}>Agregar Palabra</button>
            <button className="btn-words" type="submit">Subir Clase</button>
            </div>
          </section>
        </form>
      </div>
    </>
  )
}