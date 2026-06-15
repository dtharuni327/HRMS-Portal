import { Router, type NextFunction, type Request, type Response } from "express";
import {
  calculateTotalDays,
  calculateWorkedHours,
  findEmployeeByLogin,
  getEmployeeById,
  issueTokens,
  normalizeRole,
  readStore,
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
    };

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
      name: req.body.name ?? current.name,
      company_email: req.body.personal_email ?? req.body.email ?? current.company_email,
      personal_email: req.body.personal_email ?? req.body.email ?? current.personal_email,
      phone: req.body.phone ?? current.phone,
      designation: req.body.designation ?? current.designation,
      work_mode: req.body.work_mode ?? current.work_mode,
      employee_status: String(req.body.employee_status ?? current.employee_status).toUpperCase(),
      manager_id: req.body.manager_id ?? current.manager_id,
    };

    store.employees[index] = updated;
    await writeStore(store);

    res.status(200).json({ success: true, data: sanitizeEmployee(updated) });
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
  employeeRouter,
  holidayRouter,
  leaveRouter,
  utilityRouter,
  wfhRouter,
};
