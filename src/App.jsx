import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './utils/i18n';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { ROUTES } from './constants/routes';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';
import Projects from './pages/projects/Projects';
import AddEditProject from './pages/projects/AddEditProject';
import Estimations from './pages/estimations/Estimations';
import AddEditEstimation from './pages/estimations/AddEditEstimation';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.PROJECTS}
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.PROJECTS_ADD}
              element={
                <ProtectedRoute>
                  <AddEditProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/edit/:id"
              element={
                <ProtectedRoute>
                  <AddEditProject />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ESTIMATIONS}
              element={
                <ProtectedRoute>
                  <Estimations />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ESTIMATIONS_ADD}
              element={
                <ProtectedRoute>
                  <AddEditEstimation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/estimations/edit/:id"
              element={
                <ProtectedRoute>
                  <AddEditEstimation />
                </ProtectedRoute>
              }
            />
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
