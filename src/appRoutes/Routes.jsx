import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import CarouselPage from "@/components/dashboard/Carousel/Carousel";
import DashboardPage from "@/components/dashboard/Dash-Board";
import SpecialDaysPage from "@/components/dashboard/Special-Days/Special-Days";
import SyllabusPage from "@/components/dashboard/Syllabus/Syllabus";
import UsersPage from "@/components/dashboard/Users/Users";
import LoginPage from "@/components/login/AdminSign-in";
import ProtectedRoutes from "@/utils/ProtectedRoutes"; 
import DashboardLayoutWrapper from "@/components/Dashboard-layout";
import ClassPage from "@/components/dashboard/Syllabus/Class";
import Subjects from "@/components/dashboard/Syllabus/page/Subjects";
import ChaptersPage from "@/components/dashboard/Syllabus/page/Chapters";

export default function AppRoutes() {
  const [selectedCategories, setSelectedCategories] = useState(null)

  return (
    <Routes>
      <Route path="/sign-in" element={<LoginPage />} />

      <Route element={<ProtectedRoutes />}>
        <Route element={<DashboardLayoutWrapper />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/carousel" element={<CarouselPage />} />
          <Route path="/syllabus" element={<SyllabusPage setSelectedCategories = {setSelectedCategories} />} />
          <Route path="/syllabus/class" element={<ClassPage selectedCategories = {selectedCategories} setSelectedCategories = {setSelectedCategories} />} />
          <Route  path='/syllabus/class/subjects/:id/:no' element= {<Subjects />} />
          <Route  path='/syllabus/class/subjects/:id/:no/chapters/:chapterId' element= {<ChaptersPage />} />
          <Route path="/special-days" element={<SpecialDaysPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
