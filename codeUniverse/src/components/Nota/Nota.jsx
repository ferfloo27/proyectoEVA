import { useState } from 'react';
import './Nota.css';
import { Modal } from '../Modal/Modal';

export const Nota = ({ idVideo }) => {
  const [cueText, setCueText] = useState('');
  const [notesText, setNotesText] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [observacionGeneral, setObservacionGeneral] = useState('');
  const [evaluacionDetallada, setEvaluacionDetallada] = useState('');
  const [puntaje, setPuntaje] = useState(0);
  const userLocal = JSON.parse(localStorage.getItem('user')) || {};
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalSaveVisible, setIsModalSaveVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true)

  const handleEvaluateNotes = async () => {
    try {
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
            const updatedUser = {
              ...userLocal,
              videosInscritos: userLocal.videosInscritos?.map(video =>
                video.idVideo === idVideo
                  ? {
                    ...video,
                    apuntes: [{
                      cue: cueText,
                      notes: notesText,
                      summary: summaryText,
                      observacionGeneral: evaluation.observacionGeneral,
                      evaluacionDetallada: evaluation.evaluacionDetallada,
                      puntaje: evaluation.puntaje
                    }],
                  }
                  : video
              ),
            };

            localStorage.setItem('user', JSON.stringify(updatedUser));
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
          setCueText('')
          setNotesText('')
          setSummaryText('')
          setObservacionGeneral('')
          setEvaluacionDetallada('')
          setPuntaje(0)
          setIsDisabled(true)
          setModalVisible(true);
          setIsModalSaveVisible(false)
          setTimeout(() => setModalVisible(false), 3000);
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

  // const handleAddNote = async () => {
  //   // Actualiza el localStorage
  //   const updatedUser = {
  //     ...userLocal,
  //     videosInscritos: userLocal.videosInscritos.map(video =>
  //       video.idVideo === idVideo
  //         ? { ...video, apuntes: [noteText] }
  //         : video
  //     )
  //   };

  //   // Actualiza localStorage
  //   localStorage.setItem('user', JSON.stringify(updatedUser));

  //   try {
  //     // Realiza la solicitud PUT
  //     const response = await fetch('http://localhost/api/api.php', {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(updatedUser),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       if (data.message === 'Usuario actualizado') {
  //         setNoteText('');
  //         setModalVisible(true);
  //         setTimeout(() => setModalVisible(false), 3000);
  //       } else {
  //         console.error('Error al actualizar usuario:', data.error);
  //       }
  //     } else {
  //       console.error('Error en la respuesta de la API:', response.statusText);
  //     }
  //   } catch (error) {
  //     console.error('Error al realizar la solicitud:', error);
  //   }
  // };

  return (
    <div className="notes">
      <h2 className="titulo-det-course-note">Notas de Cornell</h2>


      <details open className="note-section">
        <summary><h3>Ideas</h3></summary>
        <textarea
          required
          value={cueText}
          onChange={(e) => setCueText(e.target.value)}
          placeholder="Añade las señales aquí (conceptos, preguntas clave)"
          rows={5}
          cols={42}
        />
      </details>

      <details open className="note-section">
        <summary><h3>Notas</h3></summary>
        <textarea
          required
          value={notesText}
          onChange={(e) => setNotesText(e.target.value)}
          placeholder="Añade las notas detalladas aquí"
          rows={10}
          cols={42}
        />
      </details>

      <details open className="note-section">
        <summary><h3>Resumen</h3></summary>
        <textarea
          required
          value={summaryText}
          onChange={(e) => setSummaryText(e.target.value)}
          placeholder="Añade un breve resumen aquí"
          rows={5}
          cols={42}
        />
      </details>

      {observacionGeneral && (
        <div className="feedback">
          <h3>Retroalimentación:</h3>
          <p><strong>Observación General:</strong> {observacionGeneral}</p>
          <p><strong>Evaluación Detallada:</strong> {evaluacionDetallada}</p>
          <p><strong>Puntaje:</strong> {puntaje}</p>        </div>
      )}
      <div className='titulo-btn-notas'>
        <button className="tarjeta-btn" onClick={handleEvaluateNotes}>Evaluar</button>
        <button disabled={isDisabled} onClick={() => setIsModalSaveVisible(true)} className="tarjeta-btn" >Guardar</button>
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
  );
};
