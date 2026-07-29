import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomeLayout from "@/layouts/HomeLayout";
import MainLayout from "@/layouts/MainLayout";
import ServiceLayout from "@/layouts/ServiceLayout";
import BusinessSimulationPage from "@/pages/BusinessSimulationPage";
import FinancePage from "@/pages/FinancePage";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import ReportPage from "@/pages/ReportPage";
import SettingsPage from "@/pages/SettingsPage";
import StartupLocationRecommendationPage from "@/pages/StartupLocationRecommendationPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <HomeLayout>
                <HomePage />
              </HomeLayout>
            }
          />
          <Route
            path="/startup-location"
            element={
              <ServiceLayout>
                <StartupLocationRecommendationPage />
              </ServiceLayout>
            }
          />
          <Route
            path="/business-simulation"
            element={
              <ServiceLayout>
                <BusinessSimulationPage />
              </ServiceLayout>
            }
          />
          <Route
            path="/finance"
            element={
              <ServiceLayout>
                <FinancePage />
              </ServiceLayout>
            }
          />
          <Route
            path="/report"
            element={
              <ServiceLayout>
                <ReportPage />
              </ServiceLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <ServiceLayout>
                <SettingsPage />
              </ServiceLayout>
            }
          />
          <Route
            path="/404"
            element={
              <ServiceLayout>
                <NotFoundPage />
              </ServiceLayout>
            }
          />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
