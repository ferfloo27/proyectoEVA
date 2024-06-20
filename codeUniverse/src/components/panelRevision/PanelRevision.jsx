import React from 'react'
import './PanelRevision.css'

export function PanelRevision({ nombreEst, apuntes }) {
  return (
    <div className='cont-revisor'>
      <div className='textarea-revision'>
        <h2>Estudiante: {nombreEst}</h2>
        <textarea className='input-revision' 
        value={apuntes} 
        rows={25} 
        cols={40} 
        autoFocus/>
      </div>
      <div className='btns-revision'>
        <button className='tarjeta-btn'>Rechazado</button>
        <button className='tarjeta-btn'>Corregido</button>

      </div>
    </div>
  )
}
