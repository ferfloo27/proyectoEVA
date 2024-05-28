import { useAuth } from '../../hooks/AuthProvider/AuthProvider';
import { VistaMaestro } from '../vistaMaestro/VistaMaestro';
import {VistaEstudiantes} from '../vistaEstudiante/VistaEstudiantes'

export const Panel = () => {
    const { user } = useAuth();

    return (
        <>
            {user.role === 'maestro' && (    
                    <VistaMaestro role={user.role} />
            )}
            {user.role === 'estudiante' && (
                <VistaEstudiantes role={user.role}/>
            )}
        </>
    );
};


