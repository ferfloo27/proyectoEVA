import { Header } from "../header/Header";
import { useState } from "react";
import { useAuth } from "../../hooks/AuthProvider/AuthProvider";
import axios from 'axios'
import './PanelAgregarVideo.css'

export function PanelAgregarVideo() {
  
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');



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

        
      </div>
    </>
  )
}