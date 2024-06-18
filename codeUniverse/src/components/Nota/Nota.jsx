import { useState } from 'react';
import './Nota.css'
import { Modal } from '../Modal/Modal';

export const Nota = ({ idVideo }) => {
  const [noteText, setNoteText] = useState('');
  const userLocal = JSON.parse(localStorage.getItem('user'))
  const [isModalVisible, setModalVisible] = useState(false);

  const handleAddNote = () => {
    const actualizado = {
      ...userLocal,
      videosInscritos: userLocal.videosInscritos.map(video =>
        video.idVideo === idVideo
          ? { ...video, apuntes: [...video.apuntes, noteText] }
          : video
      )
    };
    console.log(actualizado)
    localStorage.setItem('user', JSON.stringify(actualizado));
    setNoteText('')
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 3000)
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


