import { Navigate, RouteObject } from "react-router-dom";
import LoginPage from "./pages/login";
import AuthLayout from "./layouts/auth/auth.layout";
import MainLayout from "./layouts/main/main.layout";
import DashboardPage from "./pages/admin/dashboard";
import MasterGerbang from "./pages/admin/master-gerbang";
import MasterGerbangCreatePage from "./pages/admin/master-gerbang/create";
import MasterGerbangUpdatePage from "./pages/admin/master-gerbang/update";
import LalinPage from "./pages/admin/lalin";

export default [
  { path: "/login", element: <AuthLayout component={<LoginPage />} /> },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" /> },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "lalin",
        element: <LalinPage />,
      },
      {
        path: "master-gerbang",
        children: [
          {
            index: true,
            element: <MasterGerbang />,
          },
          {
            path: "tambah",
            element: <MasterGerbangCreatePage />,
          },
          {
            path: "edit",
            element: <MasterGerbangUpdatePage />,
          },
        ],
      },
    ],
  },
] as RouteObject[];
