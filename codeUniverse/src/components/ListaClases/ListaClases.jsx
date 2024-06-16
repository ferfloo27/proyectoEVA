import './ListaClases.css'

export const ListaClases = ({nombreClase, descripcion}) => {
  const classes = [
    'Introduction',
    'Lesson 1: Basics',
    'Lesson 2: Advanced Topics',
    // Agrega más clases aquí
  ];

  return (
    <div className="class-list">
      <h1 className='titulo-det-course'>{nombreClase}</h1>
      <h3 >{descripcion}</h3>
      <ul>
        {classes.map((cls, index) => (
          <li key={index}>{cls}</li>
        ))}
      </ul>
    </div>
  );
};


