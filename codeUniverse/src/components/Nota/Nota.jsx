import { useState } from 'react';
import './Nota.css';
import { Modal } from '../Modal/Modal';

export const Nota = ({ idVideo }) => {
  const [cueText, setCueText] = useState('');
  const [notesText, setNotesText] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [feedback, setFeedback] = useState('');
  const userLocal = JSON.parse(localStorage.getItem('user')) || {};
  const [isModalVisible, setModalVisible] = useState(false);

  const handleSaveNotes = async () => {
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
            }],
          }
          : video
      ),
    };

    // Actualiza localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));

    try {
      // Evaluar el resumen
      const evaluationResponse = await fetch('http://localhost/api/gtp.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ idVideo, summary: summaryText }),
      });

      if (evaluationResponse.ok) {
        const evaluationData = await evaluationResponse.json();
        setFeedback(evaluationData.message); // Mostrar la retroalimentación
      } else {
        console.error('Error en la evaluación:', evaluationResponse.statusText);
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
          value={cueText}
          onChange={(e) => setCueText(e.target.value)}
          placeholder="Añade las señales aquí (conceptos, preguntas clave)"
          rows={5}
          cols={43}
        />
      </details>

      <details className="note-section">
        <summary><h3>Notas</h3></summary>
        <textarea
          value={notesText}
          onChange={(e) => setNotesText(e.target.value)}
          placeholder="Añade las notas detalladas aquí"
          rows={10}
          cols={43}
        />
      </details>

      <details className="note-section">
        <summary><h3>Resumen</h3></summary>
        <textarea
          value={summaryText}
          onChange={(e) => setSummaryText(e.target.value)}
          placeholder="Añade un breve resumen aquí"
          rows={5}
          cols={43}
        />
      </details>

      {feedback && (
        <div className="feedback">
          <h3>Retroalimentación:</h3>
          <p>{feedback}</p>
        </div>
      )}
      <div className='titulo-btn-notas'>
        <button disabled={false} className="tarjeta-btn" onClick={handleSaveNotes}>Guardar</button>
        <button disabled={true} className="tarjeta-btn" >Evaluar</button>
      </div>

      <Modal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        message="Notas guardadas correctamente"
      />
    </div>
  );
};
