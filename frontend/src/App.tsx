import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { isAuthenticated } from './services/authStorage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DemoLayout } from './layouts/DemoLayout';
import { HeatmapPage } from './pages/HeatmapPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SessionDetailPage } from './pages/SessionDetailPage';
import { SessionsPage } from './pages/SessionsPage';
import { DemoHome } from './pages/demo/DemoHome';
import { DemoPricing } from './pages/demo/DemoPricing';
import { DemoProducts } from './pages/demo/DemoProducts';

const ProtectedRoute = ({ children }: { children: ReactNode }) =>
  isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/" element={<Navigate to={isAuthenticated() ? '/sessions' : '/login'} replace />} />
    <Route
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/sessions" element={<SessionsPage />} />
      <Route path="/sessions/:sessionId" element={<SessionDetailPage />} />
      <Route path="/heatmap" element={<HeatmapPage />} />
    </Route>
    <Route path="/demo" element={<DemoLayout />}>
      <Route index element={<DemoHome />} />
      <Route path="products" element={<DemoProducts />} />
      <Route path="pricing" element={<DemoPricing />} />
    </Route>
    <Route path="*" element={<Navigate to={isAuthenticated() ? '/sessions' : '/login'} replace />} />
  </Routes>
);

export default App;
