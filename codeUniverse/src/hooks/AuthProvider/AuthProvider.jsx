// AuthContext.jsx
import { createContext, useState, useContext } from 'react';
// import { getUsers, addUser } from '../../components/users';
import { useNavigate } from 'react-router-dom';
import users from '../../usuarios.json'
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });  const navigate = useNavigate();

  // const login = async ({ username, password }) => {
  //   try {
  //     const response = await fetch('http://localhost/ejemploBDeva/login.php', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ username, password }),
  //     });
  //      console.log('respuesta:' , response.json())
  //     // Verifica que la respuesta sea válida y contenga JSON
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     const data = response;
  //     if (data.success) {
  //       setUser(data.user);
  //       console.log(data.user);
  //       return true;
  //     } else {
  //       console.error('Error en el inicio de sesión:', data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error al iniciar sesión:', error);
  //   }
  //   return false;
  // };

  const login = async ({ username, password }) => {
    // Construcción de la URL con los parámetros
    const url = new URL('http://localhost/api/api.php');
    url.searchParams.append('nombreusuario', username);
    url.searchParams.append('contrasena', password);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Respuesta de la API:', data);

        if (data && data.nombreusuario) {
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
          return true;
        } else {
          console.error('Nombre de usuario o contraseña incorrectos.');
        }
      } else {
        console.error('Error en la respuesta de la API:', response.statusText);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
    return false;
  };

  // const login = ({username,password}) => {

  //   const foundUser =users.find(user => user.nombreusuario === username && user.contrasena === password);
  //   console.log(foundUser)
  //   if(foundUser) {
  //     setUser(foundUser);
  //     localStorage.setItem('user', JSON.stringify(foundUser));
  //     return true;
  //   }
  //   return false;
  // };

  const register = async (newUser) => {
    try {
      const response = await fetch('http://localhost/ejemploBDeva/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      if (data.success) {
        return true;
      } else {
        console.error('Error en el registro:', data.message)
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
    return false;
  };

  //   const register = (newUser) => {
  //     const users = getUsers();
  //     const userExists = users.some(user => user.username === newUser.username || user.email === newUser.email);
  //     if (!userExists) {
  //         addUser(newUser);
  //         return true;
  //     }
  //     return false;
  // };

  const logout = () => {
    setUser(null);
    navigate('/');
    localStorage.removeItem('user');
  };

  // const checkAuth = useCallback(() => {
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);

  // useEffect(() => {
  //   checkAuth();
  // }, [checkAuth]);

  const inscribirCurso = async (idVideo) => {
    if (user) {
      const updatedVideosInscritos = [...user.videosInscritos];
      const isVideoAlreadySubscribed = updatedVideosInscritos.some(video => video.idVideo === idVideo);
      if (!isVideoAlreadySubscribed) {
        updatedVideosInscritos.push({ idVideo, apuntes: [] });
      }

      const updatedUser = {
        ...user,
        videosInscritos: updatedVideosInscritos
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      try {
        const response = await fetch('http://localhost/api/api.php', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser)
        });
        if (!response.ok) {
          console.error('Error al inscribir el curso');
        }
      } catch (error) {
        console.error('Error al inscribir el curso:', error);
      }
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, register, inscribirCurso }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
