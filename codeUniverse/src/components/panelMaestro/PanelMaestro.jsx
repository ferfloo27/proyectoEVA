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
  const clasesSubidas = videos.filter(clase => userLocal.videosSubidos.some(subido => subido.idVideo === clase.idVideo))
  const [videosSubidos, setVideosSubidos] = useState([]);

  

  return (
    <>
      <Header />
      <main className='contenido'>
        {userLocal.rol !== null && (

          userLocal.rol === 'maestro' && (
            clasesSubidas.length > 0 ? (
              <div className="seccion-clases">
                <h1 className='titulo-clases'>Mis Cursos</h1>
                <div className="clases ">
                  {userLocal.videosSubidos.map(clase => (
                    <div key={clase.idVideo} className=' panel-maestro'>

                      <h1>{clase.idVideo}</h1>
                      
                      <h3>Lista de Estudiantes</h3>
                      {clase.inscritos.map(estudiante => (
                        <ul key={estudiante}>{estudiante}</ul>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : (<>
              <h1 className='titulo-clases'>Mis Clases</h1>
              <h2>No subiste ningun curso todavia</h2>
            </>
            )
          )
        )}
      </main>
    </>
  )
}
