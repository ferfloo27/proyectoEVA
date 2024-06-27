import React from 'react'
import './PanelRevision.css'

export function PanelRevision({ nombreEst, apuntes }) {
  return (
    <div className='cont-revisor'>
      {
        apuntes.map((nota, index) => (
          <>
            <div className='textarea-revision'>
              <h2>Estudiante: {nombreEst}</h2>
              <textarea className='input-revision'
                value={nota.cue}
                rows={5}
                cols={40}
                autoFocus />
            </div>
            <div className='textarea-revision'>
              <textarea className='input-revision'
                value={nota.notes}
                rows={15}
                cols={40}
                autoFocus />
            </div>
            <div className='textarea-revision'>
              <textarea className='input-revision'
                value={nota.summary}
                rows={10}
                cols={40}
                autoFocus />
            </div>
          </>
        ))
      }
      <div className='btns-revision'>
        <button className='tarjeta-btn'>Rechazado</button>
        <button className='tarjeta-btn'>Corregido</button>

      </div>
    </div>
  )
}
