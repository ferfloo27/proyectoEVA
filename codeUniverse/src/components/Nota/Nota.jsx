import { useState } from 'react';
import './Nota.css'

export const Nota = ({ notes, addNote }) => {
  const [noteText, setNoteText] = useState('');

  const handleAddNote = () => {
    if (noteText.trim()) {
      addNote(noteText);
      setNoteText('');
    }
  };

  return (
    <div className="notes">
      <div className='titulo-btn-notas'>
      <h1 className='titulo-det-course-note'>Notas</h1>
      <button className='btn' onClick={handleAddNote}>Añadir</button>
      </div>
      <ul>
        {notes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
      <div className="note-input">
        <input
          type="text"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Añade una nota"
        />
       
      </div>
    </div>
  );
};


