import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";

// Auth pages
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";

// Dashboard pages
import HRDashboard from "../pages/hr/HRDashboard";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import ClientDashboard from "../pages/client/ClientDashboard";
import SuperAdminDashboard from "../pages/super-admin/modules/SuperAdminDashboard";

// HR / Manager / Employee / Client pages
import EmployeeManagement from "../pages/hr/EmployeeManagement";
import TeamOverview from "../pages/manager/TeamOverview";
import MyAttendance from "../pages/employee/MyAttendance";
import ProjectTracking from "../pages/client/ProjectTracking";

// Super Admin pages
import NewUser from "../pages/super-admin/modules/NewUser";
import UserRoleManagement from "../pages/super-admin/modules/UserRoleManagement";
import LeaveTypeManagement from "../pages/super-admin/modules/LeaveTypeManagement";
import DepartmentManagement from "../pages/super-admin/modules/DepartmentManagement";
import HolidayManagement from "../pages/super-admin/modules/HolidayConfig";
import AuditLogs from "../pages/super-admin/modules/AuditLogs";
import SystemConfig from "../pages/super-admin/modules/SystemConfig";
import SystemHealth from "../pages/super-admin/modules/SystemHealth";
import AttendanceOverview from "../pages/super-admin/modules/AttendanceOverview";
import LeaveManagementOverview from "../pages/super-admin/modules/LeaveManagementOverview";
import PayrollOverview from "../pages/super-admin/modules/PayrollOverview";
import ProjectOverview from "../pages/super-admin/modules/ProjectOverview";
import SuperAdminLayout from "../components/super-admin/SuperAdminLayout";

const SuperAdminProtected = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <RoleRoute allowedRoles={["SUPER_ADMIN"]}>{children}</RoleRoute>
  </ProtectedRoute>
);

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

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
          <SuperAdminProtected>
            <SuperAdminLayout />
          </SuperAdminProtected>
        }
      >
        <Route index element={<SuperAdminDashboard />} />
        <Route path="attendance-overview" element={<AttendanceOverview />} />
        <Route path="leave-management-overview" element={<LeaveManagementOverview />} />
        <Route path="payroll-overview" element={<PayrollOverview />} />
        <Route path="new-user" element={<NewUser />} />
        <Route path="user-roles" element={<UserRoleManagement />} />
        <Route path="leave-types" element={<LeaveTypeManagement />} />
        <Route path="projects" element={<ProjectOverview />} />
        <Route path="departments" element={<DepartmentManagement />} />
        <Route path="holidays" element={<HolidayManagement />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="system-config" element={<SystemConfig />} />
        <Route path="system-health" element={<SystemHealth />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;