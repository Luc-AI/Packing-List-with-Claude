import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastContainer, GlassBackground } from './components/ui';
import { Lists } from './pages/Lists';
import { ListDetail } from './pages/ListDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';

function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <BrowserRouter>
        <GlassBackground>
          <Routes>
            {/* Auth routes - public */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />

            {/* Protected routes */}
            <Route
              path="/lists"
              element={
                <ProtectedRoute>
                  <Lists />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lists/:listId"
              element={
                <ProtectedRoute>
                  <ListDetail />
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </GlassBackground>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
