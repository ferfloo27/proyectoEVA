import React, { useState } from 'react'
import './PanelRevision.css'

export function PanelRevision({ isCorreccion, nombreEst, apuntes }) {

  const [observacionIdeas, setObservacionIdeas] = useState('')
  const [observacionNotas, setObservacionNotas] = useState('')
  const [observacionResumen, setObservacionResumen] = useState('')
  const est = nombreEst;
  const apuntesEst = apuntes;
  return (
    <div className='cont-revisor'>
      {
        apuntesEst.map((nota, index) => (
          <div key={index}>
            {est && <h2>Estudiante: {est}</h2>}
            <h3>Ideas</h3>
            <div className='textarea-revision'>
              <textarea className='input-revision'
                value={nota.cue}
                rows={5}
                cols={40}
                disabled={!isCorreccion}
                autoFocus />
            </div>
            {!est && <h4>Observaciones</h4>}
            <div className='textarea-revision'>
              <textarea className='input-revision'
                value={observacionIdeas}
                rows={2}
                cols={40}
                onChange={(e) => setObservacionIdeas(e.target.value)}

                placeholder={est ? ('Ingrese las observaciones que tiene acerca de las Ideas') : ('El maestro todavia no hizo ninguna observación')}
                disabled={isCorreccion}
              />
            </div>
            <h3>Notas</h3>
            <div className='textarea-revision'>
              <textarea className='input-revision'
                value={nota.notes}
                rows={15}
                cols={40}
                disabled={!isCorreccion}
              />
            </div>
            {!est && <h4>Observaciones</h4>}
            <div className='textarea-revision'>
              <textarea className='input-revision'
                value={observacionNotas}
                rows={2}
                cols={40}
                onChange={(e) => setObservacionNotas(e.target.value)}
                disabled={isCorreccion}
                placeholder={est ? ('Ingrese las observaciones que tiene acerca de las Notas') : ('El maestro todavia no hizo ninguna observación')}
              />
            </div>
            <h3>Resumen</h3>
            <div className='textarea-revision'>
              <textarea className='input-revision'
                value={nota.summary}
                rows={10}
                cols={40}
                disabled={!isCorreccion}
              />
            </div>
            {!est && <h4>Observaciones</h4>}
            <div className='textarea-revision'>
              <textarea className='input-revision'
                value={observacionResumen}
                rows={2}
                cols={40}
                onChange={(e) => setObservacionResumen(e.target.value)}
                disabled={isCorreccion}
                placeholder={est ? ('Ingrese las observaciones que tiene acerca del Resumen') : ('El maestro todavia no hizo ninguna observación')}
              />
            </div>
          </div>
        ))
      }
      <div >
        {est ? (
          <div className='btns-revision'>
            {/* <button className='tarjeta-btn'>Rechazar apuntes</button> */}
            <button className='tarjeta-btn'>Enviar observaciones</button>
          </div>
        ) : (
          <div className='btns-revision'>
            <button className='tarjeta-btn'>Evaluar</button>
            <button disabled={true} className='tarjeta-btn'>Guardar</button>
          </div>
        )}

      </div>
    </div>
  )
}
