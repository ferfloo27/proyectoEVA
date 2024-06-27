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


  const handleRevisar = (estudiante, apunte) => {
    setSelectedEst({ nombre: estudiante, apuntes: apunte })
    setInRevision(true)
  }

  const handleEditar = (clase) => {
    setSelectedVideo(clase)
    setIsModalEdit(true)
  }

  const handleCloseModalEdit = () => {
    setIsModalEdit(false)
  }

  return (
    <>
      <Header />
      <main className='contenido-panel-maestro'>
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
                      <div className='apuntes-content'>
                        {estudiantesInscritos.map((estudiante, index) => (
                          <div key={index} className='apuntes' >
                            {estudiante.videosInscritos.map((videoN, index) => videoN.idVideo === video.idVideo &&
                            (
                              videoN.apuntes.length > 0 && (
                                <div key={index} className='cont-apuntes'>
                                  <section>
                                    <button onClick={() => handleRevisar(estudiante.nombre, videoN.apuntes)} className='btn-revisar tarjeta-btn'>Revisar</button>
                                    <div className='apuntes-est apuntes-parrafo'>
                                      <h4>{estudiante.nombre} : Apuntes</h4>
                                      {
                                        videoN.apuntes.map((nota,index) => (
                                          < >
                                          <p key={index} >Señal :{nota.cue}</p>
                                          <p key={index} >Notas :{nota.notes}</p>
                                          <p key={index} >Resumen :{nota.summary}</p>
                                          </>
                                        ))
                                      }
                                    </div>
                                  </section>
                                </div>
                              )
                            )
                            )}
                          </div>
                        ))}
                      </div>
                    </div>)
                  )
                ))}
              </article>
            )}
            {inRevision &&
              (<article className='contenido-right'>
                <PanelRevision nombreEst={selectedEst?.nombre} apuntes={selectedEst?.apuntes} />
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
