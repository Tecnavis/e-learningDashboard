import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoutes() {
  const admin = JSON.parse(localStorage.getItem("admin"));

  return admin && admin.token   ? <Outlet /> : <Navigate to="/sign-in" />;
}
