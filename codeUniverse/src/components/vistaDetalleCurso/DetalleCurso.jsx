import './DetalleCurso.css'
import { useState } from 'react';
import { Header } from '../header/Header'
import { VideoPlayer } from '../VideoPlayer/VideoPlayer';
import { ListaClases } from '../ListaClases/ListaClases';
import { Nota } from '../Nota/Nota';
import { useLocation } from 'react-router-dom';

export function DetalleCurso() {
  const [notes, setNotes] = useState([]);
  const location = useLocation();
  const {nombreClase, descripcion, urlVideo} = location.state || {};

  const addNote = (note) => {
    setNotes([...notes, note]);
  };

  return (
    <>
      <Header />
      <main className="course-page" >
          <div className="sidebar">
            <ListaClases nombreClase={nombreClase} descripcion={descripcion} />
          </div>
          <div className="video-section">
            <VideoPlayer url={urlVideo} />
          </div>
          <div className="notes-section">
            <Nota notes={notes} addNote={addNote} />
          </div>
        
      </main>
    </>
  )
}