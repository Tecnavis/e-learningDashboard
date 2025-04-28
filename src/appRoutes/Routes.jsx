import React from "react";
import { Route, Routes } from "react-router-dom";
import CarouselPage from "@/components/dashboard/Carousel/Carousel";
import DashboardPage from "@/components/dashboard/Dash-Board";
import SpecialDaysPage from "@/components/dashboard/Special-Days/Special-Days";
import SyllabusPage from "@/components/dashboard/Syllabus/Syllabus";
import UsersPage from "@/components/dashboard/Users/Users";
import LoginPage from "@/components/login/AdminSign-in";
import ProtectedRoutes from "@/utils/ProtectedRoutes"; 
import DashboardLayoutWrapper from "@/components/Dashboard-layout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/sign-in" element={<LoginPage />} />

      <Route element={<ProtectedRoutes />}>
        <Route element={<DashboardLayoutWrapper />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/carousel" element={<CarouselPage />} />
          <Route path="/syllabus" element={<SyllabusPage />} />
          <Route path="/special-days" element={<SpecialDaysPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
