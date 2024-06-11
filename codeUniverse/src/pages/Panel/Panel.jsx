import { useAuth } from '../../hooks/AuthProvider/AuthProvider';
import { VistaMaestro } from '../vistaMaestro/VistaMaestro';
import { VistaEstudiantes } from '../vistaEstudiante/VistaEstudiantes'

export const Panel = () => {
    const { user } = useAuth();

    const changeUser = () => {
        if(user.role === 'maestro'){
            return <VistaMaestro role={user.role} />
        } else {
            if( user.role === 'estudiante'){
                return <VistaEstudiantes role={user.role} />
            }
        }
    }

    return (
        <>
            {user ? (
                changeUser()
            ) : (
            <p>no se encontro el usuario</p>
            )}

        </>
    );
};


