import { useAuth } from '../../hooks/AuthProvider/AuthProvider';
import { VistaMaestro } from '../vistaMaestro/VistaMaestro';
import { VistaEstudiantes } from '../vistaEstudiante/VistaEstudiantes'

export const Panel = () => {
    const { user } = useAuth();
    const userLocal = JSON.parse(localStorage.getItem('user'))
    

    const changeUser = () => {
        if(userLocal.rol === 'maestro'){
            return <VistaMaestro  />
        } else {
            if( userLocal.rol === 'estudiante'){
                return <VistaEstudiantes  />
            }
        }
    }

    return (
        <>
            {userLocal ? (
                changeUser()
            ) : (
            <p>no se encontro el usuario</p>
            )}

        </>
    );
};


