import React, { useEffect, useState } from 'react'
import videosJSON from '../../videos.json'
import usuariosJSON from '../../usuarios.json'
import { Tarjeta } from '../Tarjeta/Tarjeta'
import { Header } from '../header/Header'
import './PanelMaestro.css'

export function PanelMaestro() {
  const userLocal = JSON.parse(localStorage.getItem('user'))
  const videos = videosJSON
  const usuarios = usuariosJSON

  useEffect(() => {
    console.log(estudiantesInscritos)
  }, [])
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

  return (
    <>
      <Header />
      <main className='contenido'>
        {userLocal.rol !== null && (
          <ul>
            {userLocal.videosSubidos.map((video, index) => (
              videos.map(clase => (clase.idVideo === video.idVideo &&
                <div key={index} >
                  <h2>Curso: {clase.titulovideo}</h2>
                  <h3>Estudiantes</h3>
                  <div className='apuntes-content'>
                    {estudiantesInscritos.map((estudiante) => (
                      <div key={estudiante} className='apuntes' >
                        {estudiante.videosInscritos.map((nombre, index) => nombre.idVideo === video.idVideo &&
                          <div key={index} className='apuntes-est'>
                            <h4>{estudiante.nombre} : Apuntes</h4>
                            <li key={index}>{nombre.apuntes}</li>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>)
              )
            ))}

          </ul>

        )}
      </main>
    </>
  )
}
