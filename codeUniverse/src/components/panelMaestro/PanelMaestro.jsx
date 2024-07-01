import React, { useEffect, useState } from 'react'
import { Header } from '../header/Header'
import './PanelMaestro.css'
import { PanelRevision } from '../panelRevision/PanelRevision'
import { ModalEdit } from '../modalEdit/ModalEdit'

export function PanelMaestro() {
  const userLocal = JSON.parse(localStorage.getItem('user'))
  const [videos, setVideos] = useState([]);
  const [usuarios, setUsuarios] = useState([])

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
  }, []);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('http://localhost/api/api.php');
        if (response.ok) {
          const data = await response.json();
          setUsuarios(data);
        } else {
          console.error('Error en la respuesta de la API:', response.statusText);
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
      }
    };

    fetchUsuarios();
  }, []);



  // Función para extraer IDs de estudiantes inscritos
  const obtenerIdsEstudiantesInscritos = (videosSubidos) => {
    const idsEstudiantes = new Set();
    videosSubidos.forEach(video => {
      video.inscritos.forEach(id => idsEstudiantes.add(id));
    });
    return Array.from(idsEstudiantes);  // Convertimos el Set a Array
  };

  // Filtrar estudiantes inscritos
  const estudiantesInscritos = usuarios.filter(user =>
    obtenerIdsEstudiantesInscritos(userLocal.videosSubidos).includes(user.id)
  );

  const [inRevision, setInRevision] = useState(false)
  const [isModalEdit, setIsModalEdit] = useState(false)
  const [selectedEst, setSelectedEst] = useState('')
  const [selectedVideo, setSelectedVideo] = useState('')
  const [contenidoActivo, setContenidoActivo] = useState({})

  const handleContentClick = (estudiante, content) => {
    setContenidoActivo((prevState) => ({
      ...prevState,
      [estudiante]: content,
    }));
    console.log(contenidoActivo)
  };



  const handleRevisar = (estudiante, obs, apunte, videoId, datosEst) => {
    setSelectedEst({ nombre: estudiante, observaciones:obs, apuntes: apunte, estudiante: datosEst, idVideo: videoId })
    setInRevision(true)
    console.log(datosEst)
  }

  const handleEditar = (clase) => {
    setSelectedVideo(clase)
    setIsModalEdit(true)
  }

  const handleCloseModalEdit = () => {
    setIsModalEdit(false)
  }

  const getScoreClass = (score) => {
    if (score <= 25) {
      return 'low-score';
    } else if (score <= 50) {
      return 'medium-low-score';
    } else if (score <= 75) {
      return 'medium-high-score';
    } else {
      return 'high-score';
    }
  };

  return (
    <>
      <Header />
      <main className='contenido-panel-maestro'>
        <h2 className='subtit'>Mis clases</h2>
        {userLocal.rol !== null && (
          <>
            {userLocal.videosSubidos === null ? (<h3>no tienes cursos todavia</h3>) : (
              <article className='contenido-left' >
                {userLocal.videosSubidos.map((video, index) => (
                  videos.map(clase => (clase.idVideo === video.idVideo &&
                    <div key={index} className='contenido-article'  >
                      <div className='content-datos-video'>
                        <div className='datos-video'>
                          <h2>Curso: {clase.titulovideo}</h2>
                        </div>
                        <div className='btn-datos-video'>
                          <button onClick={() => handleEditar(clase)} className='tarjeta-btn'>Editar datos de video</button>
                        </div>
                      </div>

                      <h3>Estudiantes</h3>
                      {(video.inscritos.length > 0) ? (
                        <div className='apuntes-content'>
                          {estudiantesInscritos.map((estudiante, index) => (
                            <div key={index} className='apuntes' >
                              {estudiante.videosInscritos.map((videoN, index) => videoN.idVideo === video.idVideo &&
                                (
                                  <div key={index} className='cont-apuntes'>
                                    <>
                                      <div className='apuntes-est'>
                                        <h4>{estudiante.nombre}</h4>
                                        {videoN.apuntes.length > 0 ? (
                                          <div className='evaluate'>
                                            {videoN.apuntes.map((info, index) => (
                                              <>
                                                <div key={index} className={`res-test ${getScoreClass(info.puntaje)}`}>
                                                  <a href='#!' onClick={() => handleContentClick(estudiante.id, info.observacionGeneral)} className='test test-obs'><strong>Observacion General : </strong> </a>
                                                  <a href='#!' onClick={() => handleContentClick(estudiante.id, info.evaluacionDetallada)} className='test test-eva'><strong>Evaluacion:</strong>  </a>
                                                  <a href='#!' onClick={() => handleContentClick(estudiante.id, info.puntaje)} className='test test-score'><strong>Calificación:</strong> </a>
                                                </div>
                                                <div className={`res-test res-test-content ${getScoreClass(info.puntaje)}`}>
                                                  <p className='test-eva'>{contenidoActivo[estudiante.id]}</p>
                                                </div>
                                              </>
                                            ))}
                                            <button onClick={() => handleRevisar(estudiante.nombre,videoN.observaciones, videoN.apuntes, videoN.idVideo, estudiante)} className='btn-evaluate btn-apuntes tarjeta-btn'>
                                              Revisar Apuntes
                                            </button>
                                          </div>
                                        ) : (
                                          <p>El estudiante no tiene apuntes todavia</p>
                                        )}
                                        {/* {
                                        videoN.apuntes.map((nota,index) => (
                                          < >
                                          <p key={index} >Señal :{nota.cue}</p>
                                          <p key={index} >Notas :{nota.notes}</p>
                                          <p key={index} >Resumen :{nota.summary}</p>
                                          </>
                                        ))
                                      } */}
                                      </div>
                                    </>
                                  </div>

                                )
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>Todavia no tienes estudiantes inscritos</p>
                      )}
                    </div>)
                  )
                ))}
              </article>
            )}
            {inRevision &&
              (<article className='contenido-right'>
                <PanelRevision idVideo={selectedEst?.idVideo} isCorreccion={false} obs={selectedEst?.observaciones} nombreEst={selectedEst?.nombre} estudiante={selectedEst?.estudiante} apuntes={selectedEst?.apuntes} />
              </article>)}
            <ModalEdit
              isVisible={isModalEdit}
              onClose={handleCloseModalEdit}
              nombre={selectedVideo?.titulovideo}
              descriptionVideo={selectedVideo?.descripcion}
              video={selectedVideo}
            />
          </>
        )}
      </main>
    </>
  )
}
