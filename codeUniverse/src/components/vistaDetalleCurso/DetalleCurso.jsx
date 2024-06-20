import './DetalleCurso.css'
import { useState, useEffect } from 'react';
import { Header } from '../header/Header'
import { VideoPlayer } from '../VideoPlayer/VideoPlayer';
import { ListaClases } from '../ListaClases/ListaClases';
import { Nota } from '../Nota/Nota';
import { useLocation } from 'react-router-dom';

export function DetalleCurso() {
  const location = useLocation();
  const {idVideo} = location.state || {};

  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    if (idVideo) {
      fetch(`http://localhost/api/apiVideos.php?idVideo=${idVideo}`)
        .then(response => response.json())
        .then(data => setVideoData(data))
        .catch(error => console.error('Error al obtener el video:', error));

    }
  }, [idVideo]);

  if (!videoData) {
    return <div>Cargando...</div>;
  }

  const { titulovideo, descripcion, url } = videoData;


  return (
    <>
      <Header />
      <main className="course-page" >
          <div className="sidebar">
            <ListaClases nombreClase={titulovideo} descripcion={descripcion} />
          </div>
          <div className="video-section">
            <VideoPlayer url={url} />
          </div>
          <div className="notes-section">
            <Nota idVideo={idVideo} />
          </div>
        
      </main>
    </>
  )
}