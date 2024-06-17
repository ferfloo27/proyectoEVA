import { useState } from 'react';
import './Nota.css'

export const Nota = ({ idVideo }) => {
  const [noteText, setNoteText] = useState('');
  const userLocal = JSON.parse(localStorage.getItem('user'))

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
    console.log(noteText, idVideo)
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
    </div>
  );
};


