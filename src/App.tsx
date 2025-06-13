import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./context/auth-context";
import { ProjectsProvider } from "./context/projects-context";
import { LandingPage } from "./pages/landing-page";
import { LoginPage } from "./pages/login-page";
import { DashboardPage } from "./pages/dashboard-page";
import { NewRequestPage } from "./pages/new-request-page";
import { ProjectsPage } from "./pages/projects-page";
import { MainLayout } from "./components/layout/main-layout";

// Protected route component
type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Check if user is logged in (simplified for demo)
  const isAuthenticated = localStorage.getItem('user') !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <ProjectsProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <DashboardPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/new-request"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <NewRequestPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ProjectsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/\" replace />} />
            </Routes>
          </Router>
        </ProjectsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
