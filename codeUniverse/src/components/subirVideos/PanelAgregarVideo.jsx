import { Header } from "../header/Header";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/AuthProvider/AuthProvider";
import axios from 'axios'
import './PanelAgregarVideo.css'

export function PanelAgregarVideo() {
  const [video, setVideo] = useState(null);
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    axios.get('http://localhost/ejemploBDeva/fetch_video.php?id=4')
      .then(response => setVideo(response.data))
      .catch(error => console.error('Error fetching video:', error));
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fichero', file);
    formData.append('nombre', name);
    formData.append('description', description);

    axios.post('http://localhost/ejemploBDeva/upload.php', formData)
      .then(response => console.log(response.data))
      .catch(error => console.error('Error uploading file:', error));
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

        {video && (
          <div className="video">
            <h1>{video.nombre}</h1>
            <p>{video.descripcion}</p>
            <video width="450" controls>
              <source src={`http://localhost/ejemploBDeva/${video.url}`}  type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p>
              {video.url}
            </p>
          </div>
        )}
      </div>
    </>
  )
}