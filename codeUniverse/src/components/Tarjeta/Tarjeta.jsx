import './Tarjeta.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthProvider/AuthProvider';


export function Tarjeta({ idVideo, nombreClase, descripcion, urlVideo,inscrito }) {
  const navigate = useNavigate();
  const {inscribirCurso} =useAuth();

  const handleVerClase = () => {
    navigate('/detalle-curso', { state: { nombreClase, descripcion, urlVideo } });
  };

  const handleInscribirme = () => {
    inscribirCurso(idVideo);
  
  };
  
  
  return (
    <div className="contenido-tarjeta">
    {/* {thumbnail ? (
  <img className='img-tarjeta' src={thumbnail} alt="Video Thumbnail" />
) : (
  <video className='img-tarjeta' ref={videoRef} src={videoSrc} style={{ display: 'none' }} />
)} */}
    <div className="tarjeta-video">
    <video className='img-tarjeta' width="450" controls>
      {/* <source src={`http://localhost/ejemploBDeva/${urlVideo}`} type="video/mp4" /> */}
      <source src={urlVideo} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    {/* <img src={logo} alt="imagen-predeterminada" className="img-tarjeta" /> */}
    </div>
    <div className="tarjeta-datos">
      <h1 className="tarjeta-titulo">{nombreClase}</h1>
      <p className="tarjeta-descripcion"> {descripcion}</p>
      <div className="btns-tarjeta">
      <a href="/detalle-curso" onClick={handleVerClase} className="tarjeta-btn">Ver Clase</a>
      {!inscrito && <button onClick={handleInscribirme} className="tarjeta-btn">Inscribirme</button> }
     
      </div>
    </div>
</div>
  )
}