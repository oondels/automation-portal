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
import { ProjectDetailsPage } from "./pages/project-details-page";
import { MainLayout } from "./components/layout/main-layout";
import { NotificationContainer } from "./components/Notification";
import { FloatingActionButton } from "./components/ui/floating-action-button";

// Protected route component
type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Check if user is logged in (simplified for demo)
  const isAuthenticated = localStorage.getItem("user") !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/new-request"
              element={
                <ProtectedRoute>
                  <ProjectsProvider>
                    <MainLayout>
                      <NewRequestPage />
                    </MainLayout>
                  </ProjectsProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ProjectsProvider>
                    <MainLayout>
                      <DashboardPage />
                    </MainLayout>
                  </ProjectsProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <ProjectsProvider>
                    <MainLayout>
                      <ProjectsPage />
                    </MainLayout>
                  </ProjectsProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/project/:id"
              element={
                <ProtectedRoute>
                  <ProjectsProvider>
                    <MainLayout>
                      <ProjectDetailsPage />
                    </MainLayout>
                  </ProjectsProvider>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/\" replace />} />
          </Routes>
          <NotificationContainer />
          <FloatingActionButton />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
