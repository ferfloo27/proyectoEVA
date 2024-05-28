import './DetalleCurso.css'
import { useState } from 'react';
import { Header } from '../header/Header'
import { VideoPlayer } from '../VideoPlayer/VideoPlayer';
import { ListaClases } from '../ListaClases/ListaClases';
import { Nota } from '../Nota/Nota';

export function DetalleCurso() {
  const [notes, setNotes] = useState([]);

  const addNote = (note) => {
    setNotes([...notes, note]);
  };

  return (
    <>
      <Header />
      <main className="course-page" >
          <div className="sidebar">
            <ListaClases />
          </div>
          <div className="video-section">
            <VideoPlayer />
          </div>
          <div className="notes-section">
            <Nota notes={notes} addNote={addNote} />
          </div>
        
      </main>
    </>
  )
}