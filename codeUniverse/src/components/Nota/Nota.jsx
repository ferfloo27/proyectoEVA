import { useState } from 'react';
import './Nota.css'
import { Modal } from '../Modal/Modal';

export const Nota = ({ idVideo }) => {
  const [noteText, setNoteText] = useState('');
  const userLocal = JSON.parse(localStorage.getItem('user'))
  const [isModalVisible, setModalVisible] = useState(false);

  const handleAddNote = async () => {
    // Actualiza el localStorage
    const updatedUser = {
      ...userLocal,
      videosInscritos: userLocal.videosInscritos.map(video =>
        video.idVideo === idVideo
          ? { ...video, apuntes: [ noteText] }
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === 'Usuario actualizado') {
          // Opcional: refrescar el usuario del estado local después de guardar en el servidor
          setNoteText('');
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

  return (
    <div className="notes">
      <div className='titulo-btn-notas'>
      <h1 className='titulo-det-course-note'>Notas</h1>
      <button className='btn' onClick={handleAddNote}>Guardar</button>
      </div>
      
      <div className="note-input">
        <textarea
          type="text"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Añade una nota"
          rows={20}
          cols={43}
          
        />
       
      </div>
      <Modal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        message="Apuntes guardados correctamente"
      />
    </div>
  );
};


