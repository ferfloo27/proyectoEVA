
import { Tarjeta } from '../Tarjeta/Tarjeta';
import { useState, useEffect } from 'react';
import './ListaCursos.css'
import axios from 'axios'
import { useAuth } from '../../hooks/AuthProvider/AuthProvider';
import { VistaMaestro } from '../../pages/vistaMaestro/VistaMaestro';

export function ListaCursos() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  // const clasesInscritas = videos.filter(clase => user.cursosInscritos.includes(clase.id));
  // const clasesNoInscritas =videos.filter(clase => !user.cursosInscritos.includes(clase.id));


  useEffect(() => {
    axios.get('http://localhost/ejemploBDeva/fetch_video.php')
      .then(response => setVideos(response.data))
      .catch(error => console.error('Error fetching video:', error));
      console.log(videos)
  }, []);


  return (
    <>
      {user.role !== null && (
        <main className='contenido'>
          {/* {video ? <Tarjeta nombreClase={video.nombre} descripcion={video.descripcion} urlVideo={video.url}/> : 'no hay videos cargados'} */}
          {
            user.role === 'maestro' && <VistaMaestro role={user.role} />
          }
          {user.role === 'estudiante' && (
            <>
              <div className="seccion-clases">
                <h1 className='titulo-clases'>Clases Inscritas</h1>
                <div className="clases">
                  {/* {clasesInscritas.map(clase => (
                    <Tarjeta
                      key={clase.id}
                      id={clase.id}
                      nombreClase={clase.nombre}
                      descripcion={clase.descripcion}
                      urlVideo={clase.url}
                    />
                  ))} */}
                </div>
              </div>
              <div className="seccion-clases">
                <h1 className='titulo-clases'>Otras Clases</h1>
                <div className="clases">
                  {/* {clasesNoInscritas.map(clase => (
                    <Tarjeta
                      key={clase.id}
                      id={clase.id}
                      nombreClase={clase.nombre}
                      descripcion={clase.descripcion}
                      urlVideo={clase.url}
                    />
                  ))} */}
                </div>
              </div>
            </>
          )}
          {/*  {
          videos.length > 0 ? (
            videos.map(video => (
              <Tarjeta key={video.id} id={video.id} nombreClase={video.nombre} descripcion={video.descripcion} urlVideo={video.url}></Tarjeta>
            ))
          ) : ( <p>No hay videos disponibles</p>)
        } */}
        </main>
      )}


    </>
  )
}