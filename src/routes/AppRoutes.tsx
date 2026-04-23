import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

// Auth pages
import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Dashboard pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import HRDashboard from '../pages/hr/HRDashboard';
import ManagerDashboard from '../pages/manager/ManagerDashboard';
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import ClientDashboard from '../pages/client/ClientDashboard';
import SuperAdminDashboard from '../pages/superadmin/SuperAdmin';

// Other pages
import EmployeeManagement from '../pages/hr/EmployeeManagement';
import TeamOverview from '../pages/manager/TeamOverview';
import MyAttendance from '../pages/employee/MyAttendance';
import ProjectTracking from '../pages/client/ProjectTracking';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['hr']}>
              <HRDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/employees"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['hr']}>
              <EmployeeManagement />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['manager']}>
              <ManagerDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/team"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['manager']}>
              <TeamOverview />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/attendance"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['employee']}>
              <MyAttendance />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/client"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['client']}>
              <ClientDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/projects"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['client']}>
              <ProjectTracking />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['superadmin']}>
              <SuperAdminDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;