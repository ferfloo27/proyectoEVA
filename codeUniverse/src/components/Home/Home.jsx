import imagen from '../../assets/imagenIni.jpg'
import './Home.css'
import { useAuth } from '../../hooks/AuthProvider/AuthProvider';
import { Link } from 'react-router-dom';

export function Home() {

  const { login } = useAuth();
  

  const fakeUser = {
    username: 'midudev',
    profilePicture: 'https://example.com/johndoe.jpg'
  };

  const handleLogin = () => {
    
    login(fakeUser);
  };

  return (
    <div className="welcome-message">
      <div className="welcome-image-container">
        <img src={imagen} alt="Imagen de bienvenida" className="welcome-image" />
      </div>
      <div className="welcome-content">
        <h2 className="titulo-welcome">Bienvenido!!! Estás listo para programar</h2>
        <p className="parrafo-welcome">Si puedes imaginarlo, puedes programarlo</p>
        <div className="button-container">
          <Link to="/login?type=register"><button className="btn btn-est" onClick={handleLogin}><strong>Estudiante</strong></button></Link>
          <Link to="/login?type=register"><button className="btn btn-mas"><strong>Maestro</strong></button></Link>
        </div>
      </div>
    </div>
  )
}