import { BrowserRouter, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { generateRoutes } from "@/core/router/routes";
import { navigationService } from "@/core/router/navigationService";
import { initEngines } from "@/core/engines/initEngines";

function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    navigationService.setNavigator(navigate);

    initEngines();
  }, []);

  return <Routes>{generateRoutes()}</Routes>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}