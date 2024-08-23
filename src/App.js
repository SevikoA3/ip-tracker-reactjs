import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import Dashboard from "./View/Dashboard";
import React from "react";

export default function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route index element={<Dashboard/>}/>
    )
  );
  return (
    <>
    <React.StrictMode>
      <RouterProvider router={router}/>
    </React.StrictMode>
    </>
  )
}