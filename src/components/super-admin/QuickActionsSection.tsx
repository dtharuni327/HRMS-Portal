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
    },
    {
      id: "new-user",
      icon: UserPlus,
      title: "New User",
      description: "Add employees, HRs and managers",
      buttonLabel: "Create User",
      route: "/superadmin/new-user",
    },
    {
      id: "departments",
      icon: Building,
      title: "Departments",
      description: "Manage organization departments",
      buttonLabel: "View Departments",
      route: "/superadmin/departments",
    },
    {
      id: "holidays",
      icon: CalendarDays,
      title: "Holidays",
      description: "Configure company holidays",
      buttonLabel: "Manage Holidays",
      route: "/superadmin/holidays",
    },
    {
      id: "leave-types",
      icon: Plane,
      title: "Leave Types",
      description: "Configure employee leave policies",
      buttonLabel: "Open Leave Types",
      route: "/superadmin/leave-types",
    },
    {
      id: "leave-management",
      icon: Plane,
      title: "Leave Management",
      description: "Approve and manage leave requests",
      buttonLabel: "Open Leave Management",
      route: "/superadmin/leave-management-overview",
    },
    {
      id: "attendance",
      icon: Clock,
      title: "Attendance",
      description: "Monitor employee attendance",
      buttonLabel: "View Attendance",
      route: "/superadmin/attendance-overview",
    },
    {
      id: "payroll",
      icon: IndianRupee,
      title: "Payroll",
      description: "Manage payroll and salaries",
      buttonLabel: "Open Payroll",
      route: "/superadmin/payroll-overview",
    },
    {
      id: "projects",
      icon: Briefcase,
      title: "Projects",
      description: "Track ongoing company projects",
      buttonLabel: "Open Projects",
      route: "/superadmin/projects",
    },
    {
      id: "audit-logs",
      icon: FileText,
      title: "Audit Logs",
      description: "View activity and security logs",
      buttonLabel: "View Logs",
      route: "/superadmin/audit-logs",
    },
    {
      id: "system-health",
      icon: Activity,
      title: "System Health",
      description: "Monitor server and database health",
      buttonLabel: "Open Monitor",
      route: "/superadmin/system-health",
    },
    {
      id: "system-config",
      icon: Settings,
      title: "System Config",
      description: "Configure HRMS system settings",
      buttonLabel: "Open Settings",
      route: "/superadmin/system-config",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Section Header */}
      <div className="relative">
        <div className="absolute -left-6 top-0 h-12 w-1 rounded-r-full bg-gradient-to-b from-cyan-500 to-cyan-500/0" />

        <div>
          <h2 className="text-3xl font-bold text-white">Premium Quick Actions</h2>
          <p className="mt-2 text-sm text-slate-400">
            Fast access to all admin modules and configurations
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
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
          />
        ))}
      </motion.div>

      {/* Decorative bottom accent */}
      <div className="pointer-events-none flex justify-end pt-4">
        <div className="h-20 w-40 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-3xl" />
      </div>
    </motion.div>
  );
};

export default QuickActionsSection;
