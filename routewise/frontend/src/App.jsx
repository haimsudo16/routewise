import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';
import { pageTransition } from './animations/variants';

const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const CreateRoutePage = lazy(() => import('./pages/CreateRoutePage.jsx'));
const RouteDetailsPage = lazy(() => import('./pages/RouteDetailsPage.jsx'));
const HistoryPage = lazy(() => import('./pages/HistoryPage.jsx'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

function PageWrapper({ children }) {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageTransition}>
      {children}
    </motion.div>
  );
}

function FullScreenLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-base-950">
      <LoadingSpinner size={32} />
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <Suspense fallback={<FullScreenLoader />}>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
          <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PageWrapper><DashboardPage /></PageWrapper>} />
            <Route path="routes" element={<PageWrapper><HistoryPage /></PageWrapper>} />
            <Route path="routes/new" element={<PageWrapper><CreateRoutePage /></PageWrapper>} />
            <Route path="routes/:id" element={<PageWrapper><RouteDetailsPage /></PageWrapper>} />
            <Route path="routes/:id/edit" element={<PageWrapper><CreateRoutePage /></PageWrapper>} />
            <Route path="analytics" element={<PageWrapper><AnalyticsPage /></PageWrapper>} />
            <Route path="settings" element={<PageWrapper><SettingsPage /></PageWrapper>} />
          </Route>

          <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
