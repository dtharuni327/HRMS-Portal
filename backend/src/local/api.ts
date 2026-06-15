import { Router, type NextFunction, type Request, type Response } from "express";
import {
  calculateTotalDays,
  calculateWorkedHours,
  type DepartmentRecord,
  findEmployeeByLogin,
  getEmployeeById,
  issueTokens,
  normalizeRole,
  readStore,
  type RoleRecord,
  sanitizeEmployee,
  startOfToday,
  verifyAccessToken,
  verifyRefreshToken,
  writeStore,
  type EmployeeRecord,
  type RoleName,
} from "./store";

type LocalAuthRequest = Request & {
  employee?: EmployeeRecord;
};

const authRouter = Router();
const employeeRouter = Router();
const departmentRouter = Router();
const roleRouter = Router();
const holidayRouter = Router();
const leaveRouter = Router();
const wfhRouter = Router();
const attendanceRouter = Router();
const utilityRouter = Router();

const unauthorized = (res: Response, message = "Unauthorized") =>
  res.status(401).json({ success: false, message });

const forbidden = (res: Response, message = "Access denied") =>
  res.status(403).json({ success: false, message });

const authenticate = async (
  req: LocalAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return unauthorized(res, "Access token required");
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);
    const store = await readStore();
    const employee = getEmployeeById(store, decoded.Emp_id);

    if (!employee) {
      return unauthorized(res, "Employee not found");
    }

    req.employee = employee;
    next();
  } catch (error) {
    return unauthorized(res, "Invalid or expired token");
  }
};

const authorize =
  (...roles: RoleName[]) =>
  (req: LocalAuthRequest, res: Response, next: NextFunction) => {
    if (!req.employee) {
      return unauthorized(res);
    }

    const role = normalizeRole(req.employee.role_name) as RoleName;

    if (role === "SUPER_ADMIN" || roles.includes(role)) {
      return next();
    }

    return forbidden(res, "Insufficient permissions");
  };

const canAccessEmployee =
  (paramKey = "empId") =>
  async (req: LocalAuthRequest, res: Response, next: NextFunction) => {
    if (!req.employee) {
      return unauthorized(res);
    }

    const targetEmpId =
      String(req.params[paramKey] ?? req.params.Emp_id ?? req.body.empId ?? req.employee.Emp_id);

    const role = normalizeRole(req.employee.role_name) as RoleName;

    if (role === "SUPER_ADMIN" || role === "HR_ADMIN") {
      return next();
    }

    if (req.employee.Emp_id === targetEmpId) {
      return next();
    }

    if (role === "MANAGER") {
      const store = await readStore();
      const targetEmployee = getEmployeeById(store, targetEmpId);

      if (targetEmployee?.manager_id === req.employee.Emp_id) {
        return next();
      }
    }

    return forbidden(res, "You can only access your own or team data");
  };

const toDisplayTime = (isoString: string) =>
  new Date(isoString).toISOString().replace("T", " ").substring(0, 19);

const toPositiveNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const normalizeStatus = (value: unknown, fallback: "ACTIVE" | "ARCHIVED") => {
  const normalized = String(value ?? fallback).trim().toUpperCase();
  return normalized === "ARCHIVED" ? "ARCHIVED" : "ACTIVE";
};

const formatDepartment = (department: DepartmentRecord, employees: EmployeeRecord[]) => ({
  ...department,
  EmployeeCount: employees.filter((employee) => {
    if (employee.department_id && employee.department_id === department.DepartmentId) {
      return true;
    }

    return employee.department_name === department.DepartmentName;
  }).length,
});

const formatRole = (role: RoleRecord, employees: EmployeeRecord[]) => ({
  ...role,
  EmployeeCount: employees.filter((employee) => {
    if (employee.role_id && employee.role_id === role.RoleId) {
      return true;
    }

    return normalizeRole(employee.role_name) === normalizeRole(role.RoleName);
  }).length,
});

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "username and password are required" });
  }

  const store = await readStore();
  const employee = findEmployeeByLogin(store, String(username));

  if (!employee || employee.password !== String(password)) {
    return res.status(401).json({ success: false, message: "Invalid username or password" });
  }

  const { accessToken, refreshToken } = issueTokens(employee);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
    refreshToken,
    user: {
      Emp_id: employee.Emp_id,
      username: employee.username,
      name: employee.name,
      email: employee.company_email,
      role: employee.role_name,
    },
  });
});

authRouter.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body ?? {};

  if (!refreshToken) {
    return res.status(400).json({ success: false, message: "refreshToken is required" });
  }

  try {
    const decoded = verifyRefreshToken(String(refreshToken));
    const store = await readStore();
    const employee = getEmployeeById(store, decoded.Emp_id);

    if (!employee) {
      return unauthorized(res, "Employee not found");
    }

    const tokens = issueTokens(employee);
    return res.status(200).json({ success: true, ...tokens });
  } catch (_error) {
    return unauthorized(res, "Invalid refresh token");
  }
});

authRouter.post("/register", async (req, res) => {
  const store = await readStore();
  const nextId = `EMP${String(store.employees.length + 1).padStart(3, "0")}`;
  const username = String(req.body.username || `user${store.employees.length + 1}`);

  const employee: EmployeeRecord = {
    Emp_id: nextId,
    username,
    password: String(req.body.password || "Password@123"),
    name: String(req.body.name || username),
    company_email: String(req.body.email || `${username}@company.com`),
    personal_email: String(req.body.email || `${username}@company.com`),
    role_name: "EMPLOYEE",
    department_name: String(req.body.department || "General"),
    employee_status: "ACTIVE",
    designation: String(req.body.designation || "Employee"),
    work_mode: String(req.body.work_mode || "Office"),
    manager_id: null,
    location: String(req.body.location || "India"),
    phone: String(req.body.phone || "9999999999"),
    salary: Number(req.body.salary || 0),
    experience: Number(req.body.experience || 0),
    joining_date: String(req.body.joining_date || startOfToday()),
  };

  store.employees.push(employee);
  await writeStore(store);

  return res.status(201).json({
    success: true,
    message: "Registration successful",
    employee: sanitizeEmployee(employee),
  });
});

for (const routePath of [
  "/forgot-password",
  "/reset-password",
  "/send-email-verification",
  "/verify-email",
]) {
  authRouter.post(routePath, (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Demo mode: request accepted",
    });
  });
}

employeeRouter.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN", "MANAGER"),
  async (_req, res) => {
    const store = await readStore();
    res.status(200).json({ success: true, data: store.employees.map(sanitizeEmployee) });
  },
);

employeeRouter.get(
  "/:empId",
  authenticate,
  canAccessEmployee("empId"),
  async (req, res) => {
    const store = await readStore();
    const employee = getEmployeeById(store, req.params.empId);

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    return res.status(200).json({ success: true, employee: sanitizeEmployee(employee) });
  },
);

employeeRouter.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN"),
  async (req, res) => {
    const store = await readStore();
    const nextId = `EMP${String(store.employees.length + 1).padStart(3, "0")}`;

    const employee: EmployeeRecord = {
      Emp_id: nextId,
      username: String(req.body.username || req.body.name || nextId).toLowerCase().replace(/\s+/g, ""),
      password: String(req.body.password || "Password@123"),
      name: String(req.body.name || "Employee"),
      company_email: String(req.body.personal_email || req.body.email || `${nextId.toLowerCase()}@company.com`),
      personal_email: String(req.body.personal_email || req.body.email || `${nextId.toLowerCase()}@company.com`),
      role_name: "EMPLOYEE",
      department_name: String(req.body.department_name || req.body.DepartmentName || "General"),
      employee_status: String(req.body.employee_status || "ACTIVE").toUpperCase(),
      designation: String(req.body.designation || "Employee"),
      work_mode: String(req.body.work_mode || "Office"),
      manager_id: req.body.manager_id ? String(req.body.manager_id) : null,
      location: String(req.body.location || "India"),
      phone: String(req.body.phone || "9999999999"),
      salary: Number(req.body.salary || 0),
      experience: Number(req.body.experience || 0),
      joining_date: String(req.body.joining_date || startOfToday()),
      emergency_contact: req.body.emergency_contact ? String(req.body.emergency_contact) : null,
      DOB: req.body.DOB ? String(req.body.DOB) : null,
      Gender: req.body.Gender ? String(req.body.Gender) : null,
      employment_type: req.body.employment_type ? String(req.body.employment_type) : null,
      profile_image: req.body.profile_image ? String(req.body.profile_image) : null,
      client_id: toPositiveNumber(req.body.client_id),
      role_id: toPositiveNumber(req.body.role_id ?? req.body.RoleID),
      department_id: toPositiveNumber(req.body.department_id ?? req.body.Department_id),
      dashboard_id: toPositiveNumber(req.body.dashboard_id ?? req.body.Dashboard_id),
    };

    if (req.body.role_name || req.body.role) {
      employee.role_name = normalizeRole(String(req.body.role_name || req.body.role)) as RoleName;
    }

    store.employees.push(employee);
    await writeStore(store);

    res.status(201).json({ success: true, data: sanitizeEmployee(employee) });
  },
);

employeeRouter.put(
  "/:empId",
  authenticate,
  canAccessEmployee("empId"),
  async (req, res) => {
    const store = await readStore();
    const index = store.employees.findIndex((employee) => employee.Emp_id === req.params.empId);

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const current = store.employees[index];
    const updated: EmployeeRecord = {
      ...current,
      username:
        req.body.username !== undefined
          ? String(req.body.username).toLowerCase().replace(/\s+/g, "")
          : current.username,
      name: req.body.name ?? current.name,
      company_email: req.body.personal_email ?? req.body.email ?? current.company_email,
      personal_email: req.body.personal_email ?? req.body.email ?? current.personal_email,
      phone: req.body.phone ?? current.phone,
      designation: req.body.designation ?? current.designation,
      work_mode: req.body.work_mode ?? current.work_mode,
      employee_status: String(req.body.employee_status ?? current.employee_status).toUpperCase(),
      manager_id: req.body.manager_id ?? current.manager_id,
      department_name:
        req.body.department_name ?? req.body.department ?? current.department_name,
      role_name: req.body.role_name || req.body.role
        ? (normalizeRole(String(req.body.role_name || req.body.role)) as RoleName)
        : current.role_name,
      location: req.body.location ?? current.location,
      salary: req.body.salary !== undefined ? Number(req.body.salary) : current.salary,
      experience:
        req.body.experience !== undefined ? Number(req.body.experience) : current.experience,
      joining_date: req.body.joining_date ?? current.joining_date,
      emergency_contact: req.body.emergency_contact ?? current.emergency_contact ?? null,
      DOB: req.body.DOB ?? current.DOB ?? null,
      Gender: req.body.Gender ?? current.Gender ?? null,
      employment_type: req.body.employment_type ?? current.employment_type ?? null,
      profile_image: req.body.profile_image ?? current.profile_image ?? null,
      client_id:
        req.body.client_id !== undefined
          ? toPositiveNumber(req.body.client_id)
          : current.client_id ?? null,
      role_id:
        req.body.role_id !== undefined || req.body.RoleID !== undefined
          ? toPositiveNumber(req.body.role_id ?? req.body.RoleID)
          : current.role_id ?? null,
      department_id:
        req.body.department_id !== undefined || req.body.Department_id !== undefined
          ? toPositiveNumber(req.body.department_id ?? req.body.Department_id)
          : current.department_id ?? null,
      dashboard_id:
        req.body.dashboard_id !== undefined || req.body.Dashboard_id !== undefined
          ? toPositiveNumber(req.body.dashboard_id ?? req.body.Dashboard_id)
          : current.dashboard_id ?? null,
    };

    store.employees[index] = updated;
    await writeStore(store);

    res.status(200).json({ success: true, data: sanitizeEmployee(updated) });
  },
);

departmentRouter.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN"),
  async (_req, res) => {
    const store = await readStore();
    res.status(200).json({
      success: true,
      data: store.departments.map((department) => formatDepartment(department, store.employees)),
    });
  },
);

departmentRouter.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN"),
  async (req, res) => {
    const store = await readStore();
    const nextId = Math.max(0, ...store.departments.map((department) => department.DepartmentId)) + 1;

    const department: DepartmentRecord = {
      DepartmentId: nextId,
      DepartmentName: String(req.body.name ?? req.body.DepartmentName ?? "Department"),
      DepartmentCode: String(req.body.code ?? req.body.DepartmentCode ?? `DPT${nextId}`),
      DepartmentHead: String(req.body.head ?? req.body.manager ?? req.body.DepartmentHead ?? ""),
      HeadRole: String(req.body.role ?? req.body.HeadRole ?? ""),
      ParentDepartment: req.body.parentDepartment ?? req.body.ParentDepartment ?? null,
      Location: String(req.body.location ?? req.body.Location ?? "India"),
      Status: normalizeStatus(req.body.status ?? req.body.Status, "ACTIVE"),
    };

    store.departments.unshift(department);
    await writeStore(store);

    res.status(201).json({
      success: true,
      data: formatDepartment(department, store.employees),
    });
  },
);

departmentRouter.put(
  "/:departmentId",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN"),
  async (req, res) => {
    const store = await readStore();
    const departmentId = Number(req.params.departmentId);
    const index = store.departments.findIndex((department) => department.DepartmentId === departmentId);

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    const current = store.departments[index];
    const updated: DepartmentRecord = {
      ...current,
      DepartmentName: req.body.name ?? req.body.DepartmentName ?? current.DepartmentName,
      DepartmentCode: req.body.code ?? req.body.DepartmentCode ?? current.DepartmentCode,
      DepartmentHead: req.body.head ?? req.body.manager ?? req.body.DepartmentHead ?? current.DepartmentHead,
      HeadRole: req.body.role ?? req.body.HeadRole ?? current.HeadRole,
      ParentDepartment:
        req.body.parentDepartment ?? req.body.ParentDepartment ?? current.ParentDepartment,
      Location: req.body.location ?? req.body.Location ?? current.Location,
      Status:
        req.body.status !== undefined || req.body.Status !== undefined
          ? normalizeStatus(req.body.status ?? req.body.Status, current.Status)
          : current.Status,
    };

    store.departments[index] = updated;
    await writeStore(store);

    res.status(200).json({
      success: true,
      data: formatDepartment(updated, store.employees),
    });
  },
);

roleRouter.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN"),
  async (_req, res) => {
    const store = await readStore();
    res.status(200).json({
      success: true,
      data: store.roles.map((role) => formatRole(role, store.employees)),
    });
  },
);

roleRouter.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN"),
  async (req, res) => {
    const store = await readStore();
    const nextId = Math.max(0, ...store.roles.map((role) => role.RoleId)) + 1;
    const role: RoleRecord = {
      RoleId: nextId,
      RoleName: String(req.body.name ?? req.body.RoleName ?? "Role"),
      Description: String(req.body.description ?? req.body.Description ?? ""),
      Status: normalizeStatus(req.body.status ?? req.body.Status, "ACTIVE"),
    };

    store.roles.unshift(role);
    await writeStore(store);

    res.status(201).json({ success: true, data: formatRole(role, store.employees) });
  },
);

roleRouter.put(
  "/:roleId",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN"),
  async (req, res) => {
    const store = await readStore();
    const roleId = Number(req.params.roleId);
    const index = store.roles.findIndex((role) => role.RoleId === roleId);

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    const current = store.roles[index];
    const updated: RoleRecord = {
      ...current,
      RoleName: req.body.name ?? req.body.RoleName ?? current.RoleName,
      Description: req.body.description ?? req.body.Description ?? current.Description,
      Status:
        req.body.status !== undefined || req.body.Status !== undefined
          ? normalizeStatus(req.body.status ?? req.body.Status, current.Status)
          : current.Status,
    };

    store.roles[index] = updated;
    await writeStore(store);

    res.status(200).json({ success: true, data: formatRole(updated, store.employees) });
  },
);

holidayRouter.get("/all", authenticate, async (_req, res) => {
  const store = await readStore();
  res.status(200).json({ success: true, data: store.holidays });
});

holidayRouter.post("/add", authenticate, async (req, res) => {
  const store = await readStore();
  const nextId = Math.max(0, ...store.holidays.map((holiday) => holiday.HolidayId)) + 1;
  const holiday = {
    HolidayId: nextId,
    HolidayName: String(req.body.holiday_name || "Holiday"),
    HolidayDate: String(req.body.holiday_date || startOfToday()),
    Region: String(req.body.region || "India"),
    Type: String(req.body.type || "public"),
    client_id: Number(req.body.client_id || 1),
  };

  store.holidays.unshift(holiday);
  await writeStore(store);

  res.status(201).json({ success: true, data: holiday, message: "Holiday created successfully" });
});

holidayRouter.delete("/delete/:client_id", authenticate, async (req, res) => {
  const store = await readStore();
  const clientId = Number(req.params.client_id);
  store.holidays = store.holidays.filter((holiday) => holiday.client_id !== clientId);
  await writeStore(store);
  res.status(200).json({ success: true, message: "Holiday deleted successfully" });
});

holidayRouter.get("/history", authenticate, async (_req, res) => {
  const store = await readStore();
  res.status(200).json({ success: true, data: store.holidays });
});

holidayRouter.get("/total", authenticate, async (_req, res) => {
  const store = await readStore();
  res.status(200).json({ success: true, total: store.holidays.length });
});

holidayRouter.get("/used", authenticate, async (_req, res) => {
  res.status(200).json({ success: true, used: 0 });
});

holidayRouter.get("/remaining", authenticate, async (_req, res) => {
  res.status(200).json({ success: true, remaining: 0 });
});

leaveRouter.get("/", authenticate, async (req: LocalAuthRequest, res) => {
  const store = await readStore();
  const role = normalizeRole(req.employee!.role_name) as RoleName;
  const data =
    role === "EMPLOYEE"
      ? store.leaves.filter((leave) => leave.Emp_id === req.employee!.Emp_id)
      : store.leaves;
  res.status(200).json({ success: true, data });
});

leaveRouter.get("/all", authenticate, async (req: LocalAuthRequest, res) => {
  const store = await readStore();
  const role = normalizeRole(req.employee!.role_name) as RoleName;
  const data =
    role === "EMPLOYEE"
      ? store.leaves.filter((leave) => leave.Emp_id === req.employee!.Emp_id)
      : store.leaves;
  res.status(200).json({ success: true, data });
});

leaveRouter.post("/apply", authenticate, async (req: LocalAuthRequest, res) => {
  if (!req.employee) {
    return unauthorized(res);
  }

  const store = await readStore();
  const nextId = Math.max(0, ...store.leaves.map((leave) => leave.LeaveId)) + 1;
  const leave = {
    LeaveId: nextId,
    Emp_id: req.employee.Emp_id,
    EmployeeName: req.employee.name,
    LeaveType: String(req.body.leave_type || "Casual"),
    FromDate: String(req.body.from_date),
    ToDate: String(req.body.to_date),
    TotalDays: calculateTotalDays(String(req.body.from_date), String(req.body.to_date)),
    Reason: String(req.body.reason || ""),
    Status: "PENDING",
    RequestedAt: new Date().toISOString(),
  };

  store.leaves.unshift(leave);
  await writeStore(store);

  res.status(201).json({ success: true, message: "Leave request submitted", data: leave });
});

leaveRouter.put("/status/:Emp_id", authenticate, async (req, res) => {
  const { leave_id, status } = req.body ?? {};
  const store = await readStore();
  const index = store.leaves.findIndex(
    (leave) => leave.LeaveId === Number(leave_id) && leave.Emp_id === req.params.Emp_id,
  );

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Leave request not found" });
  }

  store.leaves[index] = {
    ...store.leaves[index],
    Status: String(status || "PENDING").toUpperCase(),
  };

  await writeStore(store);
  res.status(200).json({ success: true, message: "Leave status updated successfully" });
});

wfhRouter.post("/create", authenticate, async (req: LocalAuthRequest, res) => {
  if (!req.employee) {
    return unauthorized(res);
  }

  const store = await readStore();
  const nextId = Math.max(0, ...store.wfhRequests.map((request) => request.Id)) + 1;
  const request = {
    Id: nextId,
    Emp_id: req.employee.Emp_id,
    EmployeeName: req.employee.name,
    FromDate: String(req.body.from_date),
    ToDate: String(req.body.to_date),
    Reason: String(req.body.reason || ""),
    Status: "PENDING",
    RequestedAt: new Date().toISOString(),
  };

  store.wfhRequests.unshift(request);
  await writeStore(store);

  res.status(201).json({ success: true, message: "WFH request created successfully", data: request });
});

wfhRouter.get("/my-requests", authenticate, async (req: LocalAuthRequest, res) => {
  const store = await readStore();
  res.status(200).json({
    success: true,
    data: store.wfhRequests.filter((request) => request.Emp_id === req.employee!.Emp_id),
  });
});

wfhRouter.get(
  "/all-requests",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN", "MANAGER"),
  async (_req, res) => {
    const store = await readStore();
    res.status(200).json({ success: true, data: store.wfhRequests });
  },
);

wfhRouter.put(
  "/update-status/:Emp_id",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN"),
  async (req, res) => {
    const store = await readStore();
    const target = store.wfhRequests.find((request) => request.Emp_id === req.params.Emp_id);

    if (!target) {
      return res.status(404).json({ success: false, message: "WFH request not found" });
    }

    target.Status = String(req.body.status || "PENDING").toUpperCase();
    await writeStore(store);

    res.status(200).json({ success: true, message: "WFH status updated successfully", data: target });
  },
);

attendanceRouter.post("/punch-in", authenticate, async (req: LocalAuthRequest, res) => {
  if (!req.employee) {
    return unauthorized(res);
  }

  const store = await readStore();
  const today = startOfToday();
  const existing = store.attendance.find(
    (record) => record.Emp_id === req.employee!.Emp_id && record.Date === today,
  );

  if (existing && !existing.punch_out_time) {
    return res.status(400).json({ message: "Already punched in for today" });
  }

  const punchInTime = new Date().toISOString();
  const workMode = req.body.latitude && req.body.longitude ? "Office" : req.employee.work_mode || "WFH";
  const record = {
    Emp_id: req.employee.Emp_id,
    Date: today,
    punch_in_time: punchInTime,
    work_mode: workMode,
    punch_in_status: "ON_TIME",
    attendance_status: workMode === "WFH" ? "WFH" : "Present",
  };

  store.attendance = store.attendance.filter(
    (item) => !(item.Emp_id === req.employee!.Emp_id && item.Date === today),
  );
  store.attendance.unshift(record);
  await writeStore(store);

  res.status(200).json({
    success: true,
    message: "Punch in successful",
    work_mode: record.work_mode,
    punch_in_status: record.punch_in_status,
    punch_in_time: toDisplayTime(record.punch_in_time),
  });
});

attendanceRouter.post("/punch-out", authenticate, async (req: LocalAuthRequest, res) => {
  if (!req.employee) {
    return unauthorized(res);
  }

  const store = await readStore();
  const today = startOfToday();
  const record = store.attendance.find(
    (item) => item.Emp_id === req.employee!.Emp_id && item.Date === today,
  );

  if (!record) {
    return res.status(400).json({ message: "No active punch-in found for today" });
  }

  const punchOutTime = new Date().toISOString();
  record.punch_out_time = punchOutTime;
  record.total_hours = calculateWorkedHours(record.punch_in_time, punchOutTime);
  record.attendance_status = record.work_mode === "WFH" ? "WFH" : "Present";
  await writeStore(store);

  res.status(200).json({
    success: true,
    message: "Punch out successful",
    work_mode: record.work_mode,
    punch_in_time: toDisplayTime(record.punch_in_time),
    punch_out_time: toDisplayTime(punchOutTime),
    total_hours: record.total_hours,
    attendance_status: record.attendance_status,
  });
});

attendanceRouter.get(
  "/summary/:empId",
  authenticate,
  canAccessEmployee("empId"),
  async (req, res) => {
    const store = await readStore();
    const month = Number(req.query.month);
    const year = Number(req.query.year);
    const records = store.attendance.filter((record) => {
      if (record.Emp_id !== req.params.empId) {
        return false;
      }

      const recordDate = new Date(record.Date);
      return (
        (!month || recordDate.getMonth() + 1 === month) &&
        (!year || recordDate.getFullYear() === year)
      );
    });

    const totalHours = records.reduce((sum, record) => sum + Number(record.total_hours || 0), 0);
    const presentDays = records.filter((record) => record.attendance_status === "Present").length;
    const wfhDays = records.filter((record) => record.attendance_status === "WFH").length;

    res.status(200).json({
      success: true,
      data: {
        empId: req.params.empId,
        totalDays: records.length,
        presentDays,
        wfhDays,
        totalHours: Number(totalHours.toFixed(2)),
        averageHours: records.length ? Number((totalHours / records.length).toFixed(2)) : 0,
        records,
      },
    });
  },
);

attendanceRouter.get(
  "/history/:empId",
  authenticate,
  canAccessEmployee("empId"),
  async (req, res) => {
    const store = await readStore();
    res.status(200).json({
      success: true,
      data: store.attendance.filter((record) => record.Emp_id === req.params.empId),
    });
  },
);

attendanceRouter.get(
  "/dashboard",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN", "MANAGER"),
  async (_req, res) => {
    const store = await readStore();
    const today = startOfToday();
    const todaysRecords = store.attendance.filter((record) => record.Date === today);

    res.status(200).json({
      success: true,
      data: {
        totalEmployees: store.employees.length,
        presentToday: todaysRecords.filter((record) => record.attendance_status === "Present").length,
        wfhToday: todaysRecords.filter((record) => record.attendance_status === "WFH").length,
        punchedIn: todaysRecords.length,
      },
    });
  },
);

attendanceRouter.put(
  "/update/:empId/:date",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN", "MANAGER"),
  async (req, res) => {
    const store = await readStore();
    const record = store.attendance.find(
      (item) => item.Emp_id === req.params.empId && item.Date === req.params.date,
    );

    if (!record) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }

    record.attendance_status = String(req.body.attendance_status || record.attendance_status);
    record.work_mode = String(req.body.work_mode || record.work_mode);
    await writeStore(store);

    res.status(200).json({ success: true, message: "Attendance updated successfully", data: record });
  },
);

utilityRouter.get("/users", async (_req, res) => {
  const store = await readStore();
  res.status(200).json({
    users: store.employees.map((employee) => ({
      id: employee.Emp_id,
      name: employee.name,
      email: employee.company_email,
      password: employee.password,
      role: employee.role_name,
      dashboard:
        employee.role_name === "SUPER_ADMIN"
          ? "/superadmin"
          : employee.role_name === "HR_ADMIN"
            ? "/hr"
            : employee.role_name === "MANAGER"
              ? "/manager"
              : employee.role_name === "FINANCE"
                ? "/finance"
                : employee.role_name === "CLIENT"
                  ? "/client"
                  : "/employee",
    })),
  });
});

export {
  attendanceRouter,
  authRouter,
  departmentRouter,
  employeeRouter,
  holidayRouter,
  leaveRouter,
  roleRouter,
  utilityRouter,
  wfhRouter,
};
