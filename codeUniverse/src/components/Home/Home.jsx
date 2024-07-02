import { useEffect, useState } from 'react';
import imagen from '../../assets/imagenIni.jpg'
import './Home.css'
import placeholderImage from '../../assets/imagenIni.jpg';

export function Home() {

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Realiza una solicitud GET a la API para obtener los videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost/api/apiVideos.php');
        if (response.ok) {
          const data = await response.json();
          setVideos(data);
        } else {
          console.error('Error en la respuesta de la API:', response.statusText);
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
      } finally {
        setLoading(false)
      }
    };

    fetchVideos();
  }, []);


  return (
    <div className='welcome-message'>
      <section className="welcome-message-sec">
        <div className="welcome-image-container">
          <img src={imagen} alt="Imagen de bienvenida" className="welcome-image" />
        </div>
        <div className="welcome-content">
          <h2 className="titulo-welcome">Bienvenido!!! Estás listo para programar</h2>
          <p className="parrafo-welcome">Si puedes imaginarlo, puedes programarlo</p>
          <div className="button-container">
          </div>
        </div>
      </section>
      <section className="video-cards-section">
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : videos.length > 0 ? (
          <div className="video-cards-container">
            <h2 className='titulo-seccion'>Empieza a programar con nuestros cursos</h2>
            {videos.map(video => (
              <div key={video.idVideo} className="video-card">
                {/* <img
                  src={video.thumbnail || placeholderImage}
                  alt={`Imagen de ${video.titulovideo}`}
                  className="video-card-image"
                /> */}
                <video className='video-card-image' width={450}  >
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="video-card-content">
                  <h3 className="video-card-title">{video.titulovideo}</h3>
                  <p className="video-card-description">{video.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay videos disponibles</p>
        )}
      </section>
    </div>
  )
}