import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Building,
  CalendarDays,
  Plane,
  Clock,
  IndianRupee,
  Briefcase,
  FileText,
  Activity,
  Settings,
} from "lucide-react";
import QuickActionCard from "./QuickActionCard";

interface QuickAction {
  id: string;
  icon: React.FC<any>;
  title: string;
  description: string;
  buttonLabel: string;
  route: string;
  color: string;
}

const QuickActionsSection: React.FC = () => {
  const quickActions: QuickAction[] = [
    {
      id: "users-roles",
      icon: Users,
      title: "Users & Roles",
      description: "Manage user roles and permissions",
      buttonLabel: "Open Module",
      route: "/superadmin/user-roles",
      color: "#ede9fe",
    },
    {
      id: "new-user",
      icon: UserPlus,
      title: "New User",
      description: "Add employees, HRs and managers",
      buttonLabel: "Create User",
      route: "/superadmin/new-user",
      color: "#d1fae5",
    },
    {
      id: "departments",
      icon: Building,
      title: "Departments",
      description: "Manage organization departments",
      buttonLabel: "View Departments",
      route: "/superadmin/departments",
      color: "#dbeafe",
    },
    {
      id: "holidays",
      icon: CalendarDays,
      title: "Holidays",
      description: "Configure company holidays",
      buttonLabel: "Manage Holidays",
      route: "/superadmin/holidays",
      color: "#fef3c7",
    },
    {
      id: "leave-types",
      icon: Plane,
      title: "Leave Types",
      description: "Configure employee leave policies",
      buttonLabel: "Open Leave Types",
      route: "/superadmin/leave-types",
      color: "#fce7f3",
    },
    {
      id: "leave-management",
      icon: Plane,
      title: "Leave Management",
      description: "Approve and manage leave requests",
      buttonLabel: "Open Leave Management",
      route: "/superadmin/leave-management-overview",
      color: "#f5ebe0",
    },
    {
      id: "attendance",
      icon: Clock,
      title: "Attendance",
      description: "Monitor employee attendance",
      buttonLabel: "View Attendance",
      route: "/superadmin/attendance-overview",
      color: "#ede9fe",
    },
    {
      id: "payroll",
      icon: IndianRupee,
      title: "Payroll",
      description: "Manage payroll and salaries",
      buttonLabel: "Open Payroll",
      route: "/superadmin/payroll-overview",
      color: "#d1fae5",
    },
    {
      id: "projects",
      icon: Briefcase,
      title: "Projects",
      description: "Track ongoing company projects",
      buttonLabel: "Open Projects",
      route: "/superadmin/projects",
      color: "#dbeafe",
    },
    {
      id: "audit-logs",
      icon: FileText,
      title: "Audit Logs",
      description: "View activity and security logs",
      buttonLabel: "View Logs",
      route: "/superadmin/audit-logs",
      color: "#fef3c7",
    },
    {
      id: "system-health",
      icon: Activity,
      title: "System Health",
      description: "Monitor server and database health",
      buttonLabel: "Open Monitor",
      route: "/superadmin/system-health",
      color: "#fce7f3",
    },
    {
      id: "system-config",
      icon: Settings,
      title: "System Config",
      description: "Configure HRMS system settings",
      buttonLabel: "Open Settings",
      route: "/superadmin/system-config",
      color: "#f5ebe0",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* HEADER */}

      <div>
        <h2 className="text-3xl font-black text-white">
          Premium Quick Actions
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Fast access to all admin modules and configurations
        </p>
      </div>

      {/* CARDS */}

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
      >
        {quickActions.map((action, index) => (
          <QuickActionCard
            key={action.id}
            icon={action.icon}
            title={action.title}
            description={action.description}
            buttonLabel={action.buttonLabel}
            route={action.route}
            index={index}
            color={action.color}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default QuickActionsSection;