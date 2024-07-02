import React, { useEffect, useState } from 'react'
import './PanelRevision.css'
import { Modal } from '../Modal/Modal';

export function PanelRevision({ isCorreccion, nombreEst, obs, apuntes, estudiante, autorVideo, idVideo, videoTitulo }) {

  const userLocal = JSON.parse(localStorage.getItem('user')) || {};
  const [cueText, setCueText] = useState('');
  const [notesText, setNotesText] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [observacionGeneral, setObservacionGeneral] = useState('');
  const [evaluacionDetallada, setEvaluacionDetallada] = useState('');
  const [puntaje, setPuntaje] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalSaveVisible, setIsModalSaveVisible] = useState(false);

  const [observacionIdeas, setObservacionIdeas] = useState('')
  const [observacionNotas, setObservacionNotas] = useState('')
  const [observacionResumen, setObservacionResumen] = useState('')
  const [isDisabled, setIsDisabled] = useState(true)
  const [isCargando, setIsCargando] = useState(false)
  const est = nombreEst;
  const apuntesEst = apuntes;
  const datosEst = estudiante
  const obsUser = obs
  const autor = autorVideo

  useEffect(() => {
    if (obsUser.length > 0) {
      obsUser.map(observacion => (
        setObservacionIdeas(observacion.observacionIdeas),
        setObservacionNotas(observacion.observacionNotas),
        setObservacionResumen(observacion.observacionResumen)
      ))
    } else {
      setObservacionIdeas('')
      setObservacionNotas('')
      setObservacionResumen('')
    }

    if (apuntesEst.length > 0) {
      apuntesEst.map(note => (
        setCueText(note.cue),
        setNotesText(note.notes),
        setSummaryText(note.summary)
      ))
    }
  }, [obsUser, apuntesEst])

  const handleEvaluateNotes = async () => {
    try {
      setIsCargando(true)
      // Evaluar el resumen
      const evaluationResponse = await fetch('http://localhost/api/gtp.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ idVideo, summary: summaryText, cue: cueText, notes: notesText }),
      });

      if (evaluationResponse.ok) {
        const evaluationData = await evaluationResponse.json();
        console.log('datos server', evaluationData)
        // Procesa la respuesta del backend
        if (evaluationData.message) {
          // Extrae el JSON de la cadena de respuesta
          const evaluationJSON = evaluationData.message.match(/{.*}/);
          if (evaluationJSON) {
            const evaluation = JSON.parse(evaluationJSON[0]);

            setObservacionGeneral(evaluation.observacionGeneral || 'No disponible');
            setEvaluacionDetallada(evaluation.evaluacionDetallada || 'No disponible');
            setPuntaje(evaluation.puntaje || 0);

            // Actualiza el localStorage
            // const updatedUser = {
            //   ...userLocal,
            //   videosInscritos: userLocal.videosInscritos?.map(video =>
            //     video.idVideo === idVideo
            //       ? {
            //         ...video,
            //         apuntes: [{
            //           cue: cueText,
            //           notes: notesText,
            //           summary: summaryText,
            //           observacionGeneral: evaluation.observacionGeneral,
            //           evaluacionDetallada: evaluation.evaluacionDetallada,
            //           puntaje: evaluation.puntaje
            //         }],
            //       }
            //       : video
            //   ),
            // };

            // localStorage.setItem('user', JSON.stringify(updatedUser));
            setIsCargando(false)
            setIsDisabled(false); // Habilita el botón Guardar
          }
        }
      } else {
        console.error('Error en la evaluación:', evaluationResponse.statusText);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  const handleSaveNotes = async () => {
    // Actualiza el localStorage
    const updatedUser = {
      ...userLocal,
      videosInscritos: userLocal.videosInscritos.map(video =>
        video.idVideo === idVideo
          ? {
            ...video,
            apuntes: [{
              cue: cueText,
              notes: notesText,
              summary: summaryText,
              observacionGeneral,
              evaluacionDetallada,
              puntaje
            }]
          }
          : video
      )
    };

    // Actualiza localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));

    try {
      // Realiza la solicitud PUT
      const response = await fetch('http://localhost/api/api.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === 'Usuario actualizado') {

          setObservacionGeneral('')
          setEvaluacionDetallada('')
          setPuntaje(0)
          setIsDisabled(true)
          setModalVisible(true);
          setIsModalSaveVisible(false)
          setTimeout(() => setModalVisible(false), 3000);

          //Actualizar notficaciones del maestro
          const updatedAutor = {
            ...autor,
            notificaciones: [...autor.notificaciones, 'El estudiante: ' + userLocal.nombre + ' acaba de mejorar sus notas en el video: ' + videoTitulo]
          };

          // console.log('autor', updatedAutor)
          try {
            const responseAutor = await fetch('http://localhost/api/api.php', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedAutor)
            });

            if (!responseAutor.ok) {
              console.error('Error al actualizar el autor del curso');
            } else {

              // Actualiza el estado local de usuarios para reflejar el cambio
              // setUsuarios(prevUsuarios =>
              //   prevUsuarios.map(user => (user.id === autorId ? updatedAutor : user))
              // );
            }
          } catch (error) {
            console.error('Error al actualizar el autor del curso:', error);
          }

        } else {
          console.error('Error al actualizar usuario:', data.error);
        }
      } else {
        console.error('Error en la respuesta de la API:', response.statusText);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }

  };

  const handleSaveObservaciones = async () => {
    const updatedUser = {
      ...datosEst,
      notificaciones: [...datosEst.notificaciones, 'El maestro del curso: ' + videoTitulo + ' acaba de revisar tus ultimos notas'],
      videosInscritos: datosEst.videosInscritos.map(video =>
        video.idVideo === idVideo
          ? {
            ...video,
            observaciones: [{
              observacionIdeas,
              observacionNotas,
              observacionResumen
            }],
          }
          : video
      )
    };


    try {
      // Realiza la solicitud PUT
      const response = await fetch('http://localhost/api/api.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === 'Usuario actualizado') {
          setObservacionIdeas('')
          setObservacionNotas('')
          setObservacionResumen('')
        } else {
          console.error('Error al actualizar usuario:', data.error);
        }
      } else {
        console.error('Error en la respuesta de la API:', response.statusText);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  return (
    <div className='cont-revisor'>
      {

        <div>
          {est && <h2>Estudiante: {est}</h2>}
          <h3>Ideas</h3>
          <div className='textarea-revision'>
            <textarea className='input-revision'
              value={cueText}
              onChange={(e) => setCueText(e.target.value)}
              rows={5}
              cols={30}
              disabled={!isCorreccion}
              autoFocus />
          </div>
          {!est && <h4>Observaciones</h4>}
          <div className='textarea-revision'>
            <textarea className='input-revision'
              value={observacionIdeas}
              rows={2}
              cols={30}
              onChange={(e) => setObservacionIdeas(e.target.value)}
              placeholder={est ? ('Ingrese las observaciones que tiene acerca de las Ideas') : ('El maestro todavia no hizo ninguna observación')}
              disabled={isCorreccion}
            />
          </div>
          <h3>Notas</h3>
          <div className='textarea-revision'>
            <textarea className='input-revision'
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              rows={15}
              cols={30}
              disabled={!isCorreccion}
            />
          </div>
          {!est && <h4>Observaciones</h4>}
          <div className='textarea-revision'>
            <textarea className='input-revision'
              value={observacionNotas}
              rows={2}
              cols={30}
              onChange={(e) => setObservacionNotas(e.target.value)}
              disabled={isCorreccion}
              placeholder={est ? ('Ingrese las observaciones que tiene acerca de las Notas') : ('El maestro todavia no hizo ninguna observación')}
            />
          </div>
          <h3>Resumen</h3>
          <div className='textarea-revision'>
            <textarea className='input-revision'
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              rows={10}
              cols={30}
              disabled={!isCorreccion}
            />
          </div>
          {!est && <h4>Observaciones</h4>}
          <div className='textarea-revision'>
            <textarea className='input-revision'
              value={observacionResumen}
              rows={2}
              cols={30}
              onChange={(e) => setObservacionResumen(e.target.value)}
              disabled={isCorreccion}
              placeholder={est ? ('Ingrese las observaciones que tiene acerca del Resumen') : ('El maestro todavia no hizo ninguna observación')}
            />
          </div>
        </div>
      }

      <div className={`${isCargando ? 'loading-container' : 'no-visible'}`}>
        <div className="spinner"></div>
        <p>Cargando. . . </p>
      </div>

      {observacionGeneral && (
        <div className="feedback">
          <h3>Resultados:</h3>
          <p><strong>Observación General:</strong> {observacionGeneral}</p>
          <p><strong>Evaluación Detallada:</strong> {evaluacionDetallada}</p>
          <p><strong>Puntaje:</strong> {puntaje}</p>
        </div>
      )}
      <div >
        {est ? (
          <div className='btns-revision'>
            {/* <button className='tarjeta-btn'>Rechazar apuntes</button> */}
            <button onClick={handleSaveObservaciones} className='tarjeta-btn'>Enviar observaciones</button>
          </div>
        ) : (
          <div className='btns-revision'>
            <button onClick={handleEvaluateNotes} className='tarjeta-btn'>Evaluar</button>
            <button onClick={() => setIsModalSaveVisible(true)} disabled={isDisabled} className='tarjeta-btn'>Guardar</button>
          </div>
        )}

      </div>

      <Modal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        message="Notas guardadas correctamente"
      />

      <div className={`${isModalSaveVisible ? 'modal-overlay-edit ' : 'no-visible'}`}>
        <div className="modal-save-notes">
          <h1>Esta seguro que desea guardar sus apuntes?</h1>
          <h3>Si su puntaje obtenido no es el mejor, todavia puede mejorarlo</h3>
          <div className='titulo-btn-notas btn-modal'>
            <button onClick={handleSaveNotes} className='tarjeta-btn'>Guardar</button>
            <button onClick={() => setIsModalSaveVisible(false)} className='tarjeta-btn'>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  )
}
