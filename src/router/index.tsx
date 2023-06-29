import type { RouteObject } from "react-router-dom";
import LoginPage from "../pages/auth/login.page";
import ProfilePage from "../pages/turista/profile.page";
import GenerateGuide from "../pages/turista/generar";
import HistoryGuide from "../pages/turista/historial";
import ProfilePageAdmin from "../pages/admin/profile.page";
import SidebarLayout from "../layouts/SidebarLayout";
import ProfilePageDuenio from "../pages/dueño/profile.page";
import RequestSite from "../pages/dueño/solicitar-lugar";
import Solicitud from "../pages/dueño/solicitud";
const handleRequestComplete = (result:any) => {
  // Aquí puedes utilizar el resultado de la petición
  console.log(result);
  // Realiza las acciones necesarias con el resultado
};
const routes: RouteObject[] = [
  {
    path: "/",
    element: <LoginPage />,
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
        element:  <RequestSite onRequestComplete={handleRequestComplete} />,
      },
      {
        path: "solicitud",
        element: <Solicitud />,
      },

      {
        path: "generate",
        element: <GenerateGuide />,
      },
      {
        path: "history",
        element: <HistoryGuide />,
      },
      // ...otras rutas
    ],
  },
];

export default routes;