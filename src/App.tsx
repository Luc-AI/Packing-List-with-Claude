import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastContainer, GlassBackground } from './components/ui';
import { Lists } from './pages/Lists';
import { ListDetail } from './pages/ListDetail';
import { Login } from './pages/Login';
import { ResetPassword } from './pages/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <BrowserRouter>
        <GlassBackground>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
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
            <Route path="/" element={<Navigate to="/lists" replace />} />
            <Route path="*" element={<Navigate to="/lists" replace />} />
          </Routes>
        </GlassBackground>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
