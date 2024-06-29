import logo from '../../assets/logo.png'
import { useState } from 'react';
import { useAuth } from '../../hooks/AuthProvider/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../Modal/Modal';
import './LoginForm.css'

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // const handleLogin =  (e) => {
  //   e.preventDefault();
  //   const success = login({ username,password });
  //   if (success) {
  //     console.log('Inicio de sesión exitoso!');
  //     navigate('/panel');
  //   } else {
  //     console.log('Nombre de usuario o contraseña incorrectos.');
  //   }
  // };

  const [isModalVisible, setModalVisible] = useState(false);

  // const handleLogin = () => {
  //   const success = login({ username, password });
  //   if (success) {
  //     console.log('Inicio de sesión exitoso!');
  //     setModalVisible(true);
  //   setTimeout(() => setModalVisible(false), 3000)
  //     navigate('/panel')
  //   } else {
  //     console.log('Nombre de usuario o contraseña incorrectos.');
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('')
    if (!username || !password) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    const loginData = { username, password };
    const success = await login(loginData);
    if (success) {
      console.log('Inicio de sesión exitoso!');
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 3000)
      navigate('/panel')
    } else {
      setError('Nombre de usuario o contraseña incorrectos')
    }
  };


  return (
    <div className='loginContainer'>
      <form className="form-login" onSubmit={handleLogin} >
        <img src={logo} alt="Imagen de bienvenida" className="login-logo" />
        <h1>Iniciar Sesión</h1>

        <label className='label-form' htmlFor="email">Nombre de Usuario:</label>
        <input
          
          className='input input-username'
          type="username"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} />

        <label className='label-form' htmlFor="password">Contraseña:</label>
        <input
          
          className='input input-password'
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error-message">{error}</p>}

        <button className='btn-login'>Iniciar Sesión</button>
        <div className="login-buttons">
          <button className="btn-red" >
            <div className='icono'>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.43 12.62C21.43 11.95 21.37 11.31 21.26 10.69H12.40V14.33H17
                      .46C17.25 15.51 16.58 16.50 15.59 17.17V19.53H18.63C20.40 17.89 21.43 15.48 
                      21.43 12.62Z" fill="#4285F4"></path>
                <path d="M12.40 21.81C14.94 21.81 17.07 20.96 18.63 19.53L15.59 17.17C14.75 
                      17.73 13.67 18.07 12.40 18.07C9.95 18.07 7.88 16.41 7.14 14.19H4.00V16.63C5.
                      55 19.70 8.73 21.81 12.40 21.81Z" fill="#34A853"></path>
                <path d="M7.14 14.19C6.95 13.63 6.85 13.02 6.85 12.40C6.85 11.78 6.95 11.18 
                      7.14 10.62V8.18H4.00C3.36 9.45 3 10.89 3 12.40C3 13.92 3.36 15.36 4.00 16.63L7.14 
                      14.19Z" fill="#FBBC05"></path>
                <path d="M12.40 6.74C13.78 6.74 15.02 7.21 16.00 8.15L18.69 5.45C17.07 3.93 14.94 
                      3 12.40 3C8.73 3 5.55 5.11 4.00 8.18L7.14 10.62C7.88 8.39 9.95 6.74 12.40 6.74Z" fill="#EA4335"></path>
              </svg>
            </div>
            <div className='text-btn'>
              Continuar con Google
            </div>
          </button>
          <button className="btn-red" >
            <div className='icono'>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.5C22 6.25 17.75 2 12.5 2C7.25 2 3 6.25 3 11.5C3 16.24 
                          6.47 20.17 11.02 20.89V14.25H8.60V11.5H11.02V9.41C11.02 7.03 12.43 5.71 
                          14.60 5.71C15.64 5.71 16.73 5.90 16.73 5.90V8.23H15.53C14.35 8.23 13.98 8.97 
                          13.98 9.72V11.5H16.62L16.20 14.25H13.98V20.89C18.53 20.17 22 16.24 22 11.5Z" fill="#1877F2">
                </path>
                <path d="M16.20 14.25L16.62 11.5H13.98V9.72C13.98 8.97 14.35 8.23 15.53 
                          8.23H16.73V5.90C16.73 5.90 15.64 5.71 14.60 5.71C12.43 5.71 11.02 7.03 11.02
                           9.41V11.5H8.60V14.25H11.02V20.89C11.50 20.96 12.00 21 12.5 21C13.00 21 13.50 
                           20.96 13.98 20.89V14.25H16.20Z" fill="#ffffff">
                </path>
              </svg>
            </div>
            Continuar con Facebook</button>
        </div>
      </form>
      <Modal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        message="Inicio de sesion exitoso"
      />
    </div>
  )
};