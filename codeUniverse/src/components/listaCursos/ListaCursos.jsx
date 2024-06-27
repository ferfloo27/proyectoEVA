import { Tarjeta } from '../Tarjeta/Tarjeta';
import { useState, useEffect } from 'react';
import './ListaCursos.css';

export function ListaCursos() {
  const [videos, setVideos] = useState([]);
  const userLocal = JSON.parse(localStorage.getItem('user'));

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
      }
    };

    fetchVideos();
  }, []); // Se ejecuta solo una vez al montar el componente

  // Filtra los videos basados en la inscripción del usuario
  const clasesInscritas = videos.filter(clase => userLocal.videosInscritos.some(inscrito => inscrito.idVideo === clase.idVideo));
  const clasesNoInscritas = videos.filter(clase => !(userLocal.videosInscritos.some(inscrito => inscrito.idVideo === clase.idVideo )));

  return (
    <>
      {userLocal.rol !== null && (
        <main className='contenido'>
          {clasesInscritas.length > 0 ? (
            <div className="seccion-clases">
              <h1 className='titulo-clases'>Clases Inscritas</h1>
              <div className="clases">
                {clasesInscritas.map(clase => (
                  <Tarjeta
                    key={clase.idVideo}
                    idVideo={clase.idVideo}
                    autorId ={clase.usuario_idusuario}
                    nombreClase={clase.titulovideo}
                    descripcion={clase.descripcion}
                    urlVideo={clase.url}
                    inscrito={true}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              <h1 className='titulo-clases'>Clases Inscritas</h1>
              <h2>No estás inscrito todavía a ninguna clase</h2>
            </>
          )}

          <div className="seccion-clases">
            <h1 className='titulo-clases'>Otras Clases</h1>
            <div className="clases">
              {clasesNoInscritas.map(clase => (
                clase.usuario_idusuario != userLocal.id && (
                  <Tarjeta
                    key={clase.idVideo}
                    idVideo={clase.idVideo}
                    autorId ={clase.usuario_idusuario}
                    nombreClase={clase.titulovideo}
                    descripcion={clase.descripcion}
                    urlVideo={clase.url}
                    inscrito={false}
                  />
                )
              ))}
            </div>
          </div>
        </main>
      )}
    </>
  );
}
