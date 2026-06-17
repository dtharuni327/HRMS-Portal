import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";

// Auth pages
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";

// Dashboard pages
// HR and Manager dashboards removed per request
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import {
  ClientDashboard,
  InvoiceSummary,
  AssignedTeamMembers,
  Attendance,
  Chat,
  DocumentSharing,
  FeedbackSection,
  MeetingSchedule,
  Notifications,
  PaymentHistory,
  ProjectOverview as ClientProjectOverview,
  ProjectReport,
  Support,
} from "../pages/client/modules";
import SuperAdminDashboard from "../pages/super-admin/modules/SuperAdminDashboard";
import ClientLayout from "../components/client/ClientLayout";

// HR / Manager / Employee / Client pages
// EmployeeManagement and TeamOverview removed with HR/Manager pages
import MyAttendance from "../pages/employee/MyAttendance";

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
import { ManagerDashboard } from "../pages/manager/modules";
import { HRDashboard } from "../pages/hr/modules";
import FinanceDashboard from "../pages/Finance/FinanceDashboard";

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

      {/* HR and Manager routes removed */}

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

      {/* Client Routes (use layout so sidebar persists) */}
      <Route
        path="/client"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["CLIENT"]}>
              <ClientLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
          <Route index element={<ClientDashboard />} />
          {/* projects route removed (ProjectTracking component deleted) */}
          <Route path="contacts" element={<AssignedTeamMembers />} />
          <Route path="team-members" element={<AssignedTeamMembers />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="chat" element={<Chat />} />
          <Route path="documents" element={<DocumentSharing />} />
          <Route path="feedback" element={<FeedbackSection />} />
          <Route path="invoices" element={<InvoiceSummary />} />
          <Route path="calendar" element={<MeetingSchedule />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="payments" element={<PaymentHistory />} />
          <Route path="project-overview" element={<ClientProjectOverview />} />
          <Route path="project-report" element={<ProjectReport />} />
          <Route path="support" element={<Support />} />
          {/* Tasks page removed for clients */}
          <Route path="settings" element={<Navigate to="/client" replace />} />
      </Route>

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
        path="/manager/task-manager"
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
              <ManagerDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

{/* Finance Routes */}
      <Route
        path="/finance"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["FINANCE", "Finance"]}>
              <FinanceDashboard />
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