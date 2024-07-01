import React, { useEffect, useState } from 'react'
import { Header } from '../header/Header'
import './PanelApuntes.css'
import { PanelRevision } from '../panelRevision/PanelRevision'
import { ModalEdit } from '../modalEdit/ModalEdit'

export function PanelApuntes() {
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

  const [inRevision, setInRevision] = useState(false)
  const [selectedEst, setSelectedEst] = useState('')
  const [contenidoActivo, setContenidoActivo] = useState({})

  const handleContentClick = (videoId, content) => {
    setContenidoActivo((prevState) => ({
      ...prevState,
      [videoId]: content,
    }));
    console.log(contenidoActivo)
  };


  const handleRevisar = (obs,apunte) => {
    setSelectedEst({observaciones:obs, apuntes: apunte })
    setInRevision(true)
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
        <h2 className='subtit'>Mis Apuntes</h2>
        {userLocal.rol !== null && (
          <>
            {userLocal.videosInscritos === null ? (<h3>no tienes cursos todavia</h3>) : (
              <article className='contenido-left' >
                {userLocal.videosInscritos.map((video, index) => (
                  videos.map(clase => (clase.idVideo === video.idVideo &&
                    <div key={index} className='contenido-article'  >
                      <div className='content-datos-video'>
                        <div className='datos-video-panel-apuntes'>
                          <h2 className='nombre-curso'>Curso: {clase.titulovideo}</h2>
                          {
                            video.apuntes.length > 0 ?
                              (<div className='evaluate'>
                                {video.apuntes.map((info, index) => (
                                  < >
                                    <div key={index} className={`res-test ${getScoreClass(info.puntaje)}`}>
                                      <a href='#!' onClick={() => handleContentClick(video.idVideo, info.observacionGeneral)} className='test test-obs'><strong>Observacion General : </strong> </a>
                                      <a href='#!' onClick={() => handleContentClick(video.idVideo, info.evaluacionDetallada)} className='test test-eva'><strong>Evaluacion:</strong>  </a>
                                      <a href='#!' onClick={() => handleContentClick(video.idVideo, info.puntaje)} className='test test-score'><strong>Calificación:</strong> </a>
                                    </div>
                                    <div className={`res-test res-test-content ${getScoreClass(info.puntaje)}`}>
                                      <p className='test-eva'>{contenidoActivo[video.idVideo]}</p>
                                    </div>
                                  </>
                                ))}
                                <button onClick={() => handleRevisar(video.observaciones,video.apuntes)} className='btn-evaluate btn-apuntes tarjeta-btn'>
                                  Mejorar Apuntes
                                </button>
                              </div>
                              ) : (
                                <p>No tienes apuntes de este curso</p>
                              )
                          }
                        </div>
                      </div>
                      {/* <div>{video.apuntes.map((apunte, index) => (
                        <section className='apuntes-est apuntes-parrafo' key={index}>
                          <p >Ideas: {apunte.cue}</p>
                          <p >Notas: {apunte.notes}</p>
                          <p >Apuntes: {apunte.summary}</p>
                        </section>
                      ))}</div> */}
                    </div>)
                  )
                ))}
              </article>
            )}
            {inRevision &&
              (<article className='contenido-right'>
                <PanelRevision isCorreccion={true} obs={selectedEst?.observaciones} apuntes={selectedEst?.apuntes} />
              </article>)}
          </>
        )}
      </main>
    </>
  )
}
