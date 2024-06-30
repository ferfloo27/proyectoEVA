import React from 'react'
import './PanelRevision.css'

export function PanelRevision({isCorreccion, nombreEst, apuntes }) {

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
                autoFocus />
            </div>
              {!est && <h4>Observaciones</h4>}
            <div className='textarea-revision'>
              <textarea className='input-revision'
                value={''}
                rows={2}
                cols={40}
                placeholder='ingrese un comentario'
                disabled={isCorreccion}
                />
              </div>
                <h3>Notas</h3>
            <div className='textarea-revision'>
              <textarea className='input-revision'
                value={nota.notes}
                rows={15}
                cols={40}
                />
            </div>
            {!est && <h4>Observaciones</h4>}
            <div className='textarea-revision'>
              <textarea className='input-revision'
                value={''}
                rows={2}
                cols={40}
                disabled={isCorreccion}
                placeholder='ingrese un comentario'
                />
            </div>
                <h3>Resumen</h3>
            <div className='textarea-revision'>
              <textarea className='input-revision'
                value={nota.summary}
                rows={10}
                cols={40}
              />
            </div>
            {!est && <h4>Observaciones</h4>}
            <div className='textarea-revision'>
              <textarea className='input-revision'
                value={''}
                rows={2}
                cols={40}
                disabled={isCorreccion}
                placeholder='ingrese un comentario'
                />
            </div>
          </div>
        ))
      }
      <div >
        {est ? (
          <div className='btns-revision'>
            <button className='tarjeta-btn'>Rechazar apuntes</button>
            <button className='tarjeta-btn'>Aceptar apuntes</button>
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
