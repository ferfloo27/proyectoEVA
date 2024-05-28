import { ListaCursos } from "../../components/listaCursos/ListaCursos";
import { Header } from "../../components/header/Header";

export function VistaEstudiantes({role}) {
    return (
        <>
            <Header role={role} />
            <ListaCursos />
        </>
    )
}