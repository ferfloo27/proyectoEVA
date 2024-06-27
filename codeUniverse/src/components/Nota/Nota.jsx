import { useState } from 'react';
import './Nota.css';
import { Modal } from '../Modal/Modal';

export const Nota = ({ idVideo }) => {
  const [cueText, setCueText] = useState('');
  const [notesText, setNotesText] = useState('');
  const [summaryText, setSummaryText] = useState('');
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
              apuntes:[ {
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
          // Opcional: refrescar el usuario del estado local después de guardar en el servidor
          setModalVisible(true);
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
      <div className='titulo-btn-notas'>
      <h2 className="titulo-det-course-note">Notas de Cornell</h2>
      <button className="btn" onClick={handleSaveNotes}>Guardar</button>
      </div>

      <div className="note-section">
        <h3>Señal</h3>
        <textarea
          value={cueText}
          onChange={(e) => setCueText(e.target.value)}
          placeholder="Añade las señales aquí (conceptos, preguntas clave)"
          rows={5}
          cols={43}
        />
      </div>

      <div className="note-section">
        <h3>Notas</h3>
        <textarea
          value={notesText}
          onChange={(e) => setNotesText(e.target.value)}
          placeholder="Añade las notas detalladas aquí"
          rows={10}
          cols={43}
        />
      </div>

      <div className="note-section">
        <h3>Resumen</h3>
        <textarea
          value={summaryText}
          onChange={(e) => setSummaryText(e.target.value)}
          placeholder="Añade un breve resumen aquí"
          rows={5}
          cols={43}
        />
      </div>

      <Modal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        message="Notas guardadas correctamente"
      />
    </div>
  );
};
