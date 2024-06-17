
import { Tarjeta } from '../Tarjeta/Tarjeta';
import { useState, useEffect } from 'react';
import './ListaCursos.css'
import axios from 'axios'
import { useAuth } from '../../hooks/AuthProvider/AuthProvider';
import { VistaMaestro } from '../../pages/vistaMaestro/VistaMaestro';
import videosJSON from '../../videos.json'

export function ListaCursos() {
  const userLocal = JSON.parse(localStorage.getItem('user'))
  const videos = videosJSON
  const clasesSubidas = videos.filter(clase => userLocal.videosSubidos.some(subido => subido.idVideo === clase.idVideo))
  const clasesInscritas = videos.filter(clase => userLocal.videosInscritos.some(inscrito => inscrito.idVideo === clase.idVideo));
  const clasesNoInscritas = videos.filter(clase => !(userLocal.videosInscritos.some(inscrito => inscrito.idVideo === clase.idVideo)));
  console.log('inscritas', clasesInscritas)
  console.log('mis clases', clasesSubidas)

  // useEffect(() => {
  //   axios.get('http://localhost/ejemploBDeva/fetch_video.php')
  //     .then(response => setVideos(response.data))
  //     .catch(error => console.error('Error fetching video:', error));
  //     console.log(videos)
  // }, []);




  return (
    <>
      {userLocal.rol !== null && (
        <main className='contenido'>
          {/* {video ? <Tarjeta nombreClase={video.nombre} descripcion={video.descripcion} urlVideo={video.url}/> : 'no hay videos cargados'} */}
          {/* {userLocal.rol === 'maestro' && (
            clasesSubidas.length > 0 ? (
              <div className="seccion-clases">
                <h1 className='titulo-clases'>Mis Cursos</h1>
                <div className="clases">
                  {clasesSubidas.map(clase => (
                    <Tarjeta
                      key={clase.idVideo}
                      idVideo={clase.idVideo}
                      nombreClase={clase.titulovideo}
                      descripcion={clase.descripcion}
                      urlVideo={clase.url}
                      inscrito ={true}
                    />
                  ))}
                </div>
              </div>
            ) : (<>
            <h1 className='titulo-clases'>Mis Clases</h1>
            <h2>No subiste ningun curso todavia</h2>
            </>
            )
          )} */}
          {clasesInscritas.length > 0 ? (
            <div className="seccion-clases">
              <h1 className='titulo-clases'>Clases Inscritas</h1>
              <div className="clases">
                {clasesInscritas.map(clase => (
                  <Tarjeta
                    key={clase.idVideo}
                    idVideo={clase.idVideo}
                    nombreClase={clase.titulovideo}
                    descripcion={clase.descripcion}
                    urlVideo={clase.url}
                    inscrito ={true}
                  />
                ))}
              </div>
            </div>
          ) : (<>
          <h1 className='titulo-clases'>Clases Inscritas</h1>
          <h2>No estas inscrito todavia a ninguna clase</h2>
          </>
          )}
          
          <>

            <div className="seccion-clases">
              <h1 className='titulo-clases'>Otras Clases</h1>
              <div className="clases">
                {clasesNoInscritas.map(clase => (
                  <Tarjeta
                    key={clase.idVideo}
                    idVideo={clase.idVideo}
                    nombreClase={clase.titulovideo}
                    descripcion={clase.descripcion}
                    urlVideo={clase.url}
                    inscrito={false}
                  />
                ))}
              </div>
            </div>
          </>
          {/* {
            
          videos.length > 0 ? (
            videos.map(video => (
              <Tarjeta key={video.idVideo} id={video.idVideo} nombreClase={video.titulovideo} descripcion={video.descripcion} urlVideo={video.url}></Tarjeta>
            ))
          ) : ( <p>No hay videos disponibles</p>)
        } */}
        </main>
      )}


    </>
  )
}