import React from 'react'
import './PanelRevision.css'

export function PanelRevision ({nombreEst,apuntes}) {
  return (
    <div className='cont-revisor'>
      <h3>Estudiante: {nombreEst}</h3>
      <textarea value={apuntes} rows={20} cols={45} />
      <button className='tarjeta-btn'> Guardar cambios</button>
    </div>
  )
}
