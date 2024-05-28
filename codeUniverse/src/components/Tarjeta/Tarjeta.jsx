import './Tarjeta.css'
import logo from '../../assets/tarjeta-fondo.jpg'
import { useState } from 'react';
import { IconCirclePlusFilled } from '@tabler/icons-react';


export function Tarjeta() {

  
  return (
    <div className='main-docente'>
      <div className="contenido-tarjeta">
        <div className="tarjeta">
          <img src={logo} alt="imagen-predeterminada" className="img-tarjeta" />
          <div className="tarjeta-contenido">
            <h1 className="tarjeta-titulo">Introducción a la Programacion</h1>
            <p className="tarjeta-descripcion"> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
            <a href="/detalle-curso" className="tarjeta-btn">Ver Clase</a>
          </div>
        </div>

      </div>
      
     
    </div>
  )
}