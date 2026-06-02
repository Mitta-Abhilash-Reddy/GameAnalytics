import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage }      from './pages/LoginPage'
import { RegisterPage }   from './pages/RegisterPage'
import { DashboardPage }  from './pages/DashboardPage'
import { EventsPage }     from './pages/EventsPage'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { PrivateRoute }   from './components/ui/PrivateRoute'

export const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Public */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected */}
      <Route
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/events"    element={<EventsPage />} />
      </Route>

      {/* Default */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </BrowserRouter>
)
