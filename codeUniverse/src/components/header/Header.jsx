import './Header.css'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/AuthProvider/AuthProvider'
import { useState } from 'react';
import { IconBellFilled } from '@tabler/icons-react';

export function Header() {

  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'))
  const [noti, setNoti] = useState([3, 8])

  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsMenuOpen(false);
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className='encabezado'>
      <Link to='/panel' className='encabezado-left'>
        <img src={logo} alt='logo codeUniverse' className='encabezado-logo' />
        <h1 className='encabezado-titulo'>Code Universe</h1>
      </Link>
      {
        user ? (
          <div className='encabezado-user-principal'>
            <div className="notification-button">
              <button onClick={toggleDropdown} className="bell-button">
                <IconBellFilled size={30} className='fa-bell' />
                {user.notificaciones.length > 0 && <span className="notification-count">{user.notificaciones.length}</span>}
              </button>
              {isOpen && (
                <div className="notification-dropdown">
                  <ul>
                    {user.notificaciones.map((notification, index) => (
                      <li key={index}>{notification}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="encabezado-user user-menu-container"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>



              <img
                className='avatar-user'
                alt='avatar'
                src={`https://unavatar.io/${user.nombreusuario}`}
              />
              <span className='name-user'>{user.nombreusuario}</span>
              {isMenuOpen && (
                <div className="user-menu">
                  <div className='seccion seccion-datos'>
                    <img
                      className='avatar-user avatar-menu'
                      alt='avatar'
                      src={`https://unavatar.io/${user.nombreusuario}`}
                    />
                    <div className="seccion-datos-texto">
                      <p className='datos-name' > {user.nombre}</p>
                      <p className='datos-email'> {user.correoelec}</p>
                    </div>
                  </div>
                  <div className="seccion seccion-opciones">
                    {/* <Link className='settings'>Mi cuenta</Link> */}
                    {user.rol === 'maestro' && (<Link to={'/panel-maestro'} className='settings'>Mis cursos</Link>)}
                    <Link to={'/panel-apuntes'} className='settings'>Mis apuntes</Link>
                    <Link className='settings'>Ajustes</Link>
                    {user.rol === 'maestro' && (<Link to={'/agregar-videos'} className='settings'>Agregar</Link>)}
                  </div>
                  <div className="seccion seccion-logout">
                    <button className='btn-logout' onClick={logout}>Cerrar Sesión</button>
                  </div>
                </div>
              )}
            </div>
          </div>

        ) : (

          <nav className='encabezado-btns'>
            <Link to="/login?type=login">
              <button className=' btn-login-header'>Inicia Sesión</button>
            </Link>
            <Link to="/login?type=register">
              <button className=' btn-login-header'>Registrate</button>
            </Link>
          </nav>

        )
      }
    </header>
  )
}