import type { RouteObject } from "react-router-dom";
//import Layout from "../components/Layout";

import LoginPage from "../pages/auth/login.page";
import ProfilePage from "../pages/turista/profile.page";

import GenerateGuide from "../pages/turista/generar";
import HistoryGuide from "../pages/turista/historial";
import ProfilePageAdmin from "../pages/admin/profile.page";
import SidebarLayout from "../layouts/SidebarLayout";
import ProfilePageDuenio from "../pages/dueño/profile.page";
import RequestSite from "../pages/dueño/solicitar";


const authRoutes: RouteObject = {
  path: "/",
  element: <LoginPage />,
};

const normalRoutes: RouteObject = {
  path: "*",
  element: <SidebarLayout />,
  children: [
    {
      path: "profile-turista",
      children: [
        {
          path: "",
          element: <ProfilePage />,
        },
      ],
    },
    {
      path: "profile-admin",
      children: [
        {
          path: "",
          element: <ProfilePageAdmin />,
        },
      ],
    },
    {
      path: "profile-duenio",
      children: [
        {
          path: "",
          element: <ProfilePageDuenio />,
        },
      ],
    },
    {
      path: "request",
      children: [
        {
          path: "",
          element: <RequestSite />,
        },
      ],
    }
    ,

    {
      path: "generate",
      children: [
        {
          path: "",
          element: <GenerateGuide />,
        },
      ],
    }
    ,
    {
      path: "history",
      children: [
        {
          path: "",
          element: <HistoryGuide />,
        },
      ],
    },
  ],
};

const routes: RouteObject[] = [authRoutes, normalRoutes];

export default routes;
