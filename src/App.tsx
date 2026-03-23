/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import OnboardingModal from './components/OnboardingModal';
import Terminal from './pages/Terminal';
import Markets from './pages/Markets';
import Portfolio from './pages/Portfolio';
import Academy from './pages/Academy';
import SignIn from './pages/SignIn';
import PrivacyPolicy from './pages/PrivacyPolicy';
import GetStarted from './pages/GetStarted';
import { AppProvider, useAppContext } from './context/AppContext';

function AppRoutes() {
  const { isAuthenticated } = useAppContext();

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/privacy" element={
        <Layout>
          <PrivacyPolicy />
        </Layout>
      } />
      <Route path="/get-started" element={
        isAuthenticated ? <Layout><GetStarted /></Layout> : <Navigate to="/signin" />
      } />
      <Route path="/" element={
        isAuthenticated ? <Layout><Terminal /></Layout> : <Navigate to="/signin" />
      } />
      <Route path="/markets" element={
        isAuthenticated ? <Layout><Markets /></Layout> : <Navigate to="/signin" />
      } />
      <Route path="/portfolio" element={
        isAuthenticated ? <Layout><Portfolio /></Layout> : <Navigate to="/signin" />
      } />
      <Route path="/academy" element={
        isAuthenticated ? <Layout><Academy /></Layout> : <Navigate to="/signin" />
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster theme="dark" position="top-right" />
        <OnboardingModal />
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
