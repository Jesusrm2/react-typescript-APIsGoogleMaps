import type { RouteObject } from "react-router-dom";
import LoginPage from "../pages/auth/login.page";
import ProfilePage from "../pages/turista/profile.page";
import ProfilePageAdmin from "../pages/admin/profile.page";
import SidebarLayout from "../layouts/SidebarLayout";
import ProfilePageDuenio from "../pages/dueño/profile.page";
import PrincipalComponent from "../pages/dueño/solicitud-principal";
import EstadoSolicitud from "../pages/dueño/solicitud-estado";
import Solicitudes from "../pages/dueño/estado";
import GenerarItinerario from "../pages/turista/generar";
import Historial from "../pages/turista/historial";
import Restablecer from "../pages/auth/restablecer";
import FormRegistrar from "../pages/auth/registrar";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/restablecer",
    element: <Restablecer />,
  },
  {
    path: "/registrar",
    element: <FormRegistrar />,
  },
  {
    path: "/perfil",
    element: <SidebarLayout />,
    children: [
      {
        path: "profile-turista",
        element: <ProfilePage />,
      },
      {
        path: "profile-admin",
        element: <ProfilePageAdmin />,
      },
      /*DUENIO LOCAL*/
      {
        path: "profile-duenio",
        element: <ProfilePageDuenio />,
      },
      {
        path: "request",
        element:  <PrincipalComponent />,
      },
      {
        path: "estado",
        element:  <EstadoSolicitud />,
      },
      {
        path: "solicitudes",
        element:  <Solicitudes />,
      },{
        path: "generate",
        element: <GenerarItinerario />,
      },
      {
        path: "history",
        element: <Historial />,
      },
      // ...otras rutas
    ],
  },
];

export default routes;