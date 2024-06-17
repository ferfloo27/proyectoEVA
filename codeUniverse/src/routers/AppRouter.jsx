import { Routes, Route } from "react-router-dom"
import { HomePage } from "../pages/home/HomePage"
import { VistaEstudiantes } from "../pages/vistaEstudiante/VistaEstudiantes"
import { VistaMaestro } from "../pages/vistaMaestro/VistaMaestro"
import { VistaLogin } from '../pages/vistaLogin/VistaLogin'
import { DetalleCurso } from "../components/vistaDetalleCurso/DetalleCurso"
import { AuthProvider } from "../hooks/AuthProvider/AuthProvider"
import {PanelAgregarVideo} from '../components/subirVideos/PanelAgregarVideo'
import {Panel} from '../pages/Panel/Panel'
import { PanelMaestro } from "../components/panelMaestro/PanelMaestro"

export const AppRouter = () =>{
  
  
    return(
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/panel" element={<Panel/>} />
            <Route path="/lista-cursos-es" element={<VistaEstudiantes/>}/>
            <Route path="/lista-cursos-ma" element={<VistaMaestro/>}/>
            <Route path="/login" element={<VistaLogin/>}/>
            <Route path="/detalle-curso" element={<DetalleCurso/>}/>
            <Route path="/agregar-videos" element={<PanelAgregarVideo/>}/>
            <Route path="/*" element={<HomePage/>}/>
            <Route path="/panel-maestro" element={<PanelMaestro/>}/>
        </Routes>
    )
}

const RootApp = () => (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
  
  export default RootApp;