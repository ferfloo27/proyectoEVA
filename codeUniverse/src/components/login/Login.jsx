import './Login.css'

import { useLocation,} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LoginForm } from '../LoginForm/LoginForm';
import { RegisterForm } from '../RegisterForm/RegisterForm';

const LoginPage = () => {
  const location = useLocation();
  const [formType, setFormType] = useState('login');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type) {
      setFormType(type);
    }
  }, [location]);

  

  return (
    <div>
      {!formType && (
        <div>
          <button
            onClick={() => setFormType('login')}
          >
            Inicio de Sesión
          </button>
          <button
            onClick={() => setFormType('register')}
          >
            Registrarse
          </button>
        </div>
      )}
      {formType === 'login' && <LoginForm />}
      {formType === 'register' && <RegisterForm />}
    </div>
  );
};




export default LoginPage;




