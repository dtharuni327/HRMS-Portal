import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";

// Auth pages
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";

// Dashboard pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import HRDashboard from "../pages/hr/HRDashboard";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import ClientDashboard from "../pages/client/ClientDashboard";
import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard";

// Other pages
import EmployeeManagement from "../pages/hr/EmployeeManagement";
import TeamOverview from "../pages/manager/TeamOverview";
import MyAttendance from "../pages/employee/MyAttendance";
import ProjectTracking from "../pages/client/ProjectTracking";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["HR_ADMIN", "SUPER_ADMIN"]}>
              <AdminDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* HR Routes */}
      <Route
        path="/hr"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["HR_ADMIN"]}>
              <HRDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/employees"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["HR_ADMIN"]}>
              <EmployeeManagement />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Manager Routes */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["MANAGER"]}>
              <ManagerDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/team"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["MANAGER"]}>
              <TeamOverview />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Employee Routes */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/attendance"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["EMPLOYEE"]}>
              <MyAttendance />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Client Routes */}
      <Route
        path="/client"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["CLIENT"]}>
              <ClientDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/projects"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["CLIENT"]}>
              <ProjectTracking />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Super Admin Routes */}
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["SUPER_ADMIN"]}>
              <SuperAdminDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;