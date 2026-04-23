import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword"; // 1. Add this import

import SuperAdmin from "./pages/superadmin/SuperAdmin";
import HRDashboard from "./pages/hr/HRDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import FinanceDashboard from "./pages/finance/FinanceDashboard";
import ClientDashboard from "./pages/client/ClientDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* 2. Add the route for Forgot Password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ALL DASHBOARDS */}
        <Route path="/superadmin" element={<SuperAdmin />} />
        <Route path="/hr" element={<HRDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/finance" element={<FinanceDashboard />} />
        <Route path="/client" element={<ClientDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;