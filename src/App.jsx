import React from "react";
import { ThemeProvider } from "next-themes";
import DashBoardLayout from "./components/dashboard/Dash-Board-Layout";


export default function App() {

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
     
      <DashBoardLayout />
    </ThemeProvider>
  );
}
