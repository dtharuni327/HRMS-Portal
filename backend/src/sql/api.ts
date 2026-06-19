import { Router, type NextFunction, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sql from "mssql";
import { db } from "../config/db";
import { ensureSupportExtensions } from "./bootstrap";

type AuthUser = {
  employeeId: number;
  Emp_id: string;
  username: string;
  role: string;
  name: string;
  email: string | null;
  managerEmployeeId: number | null;
};

type SqlAuthRequest = Request & {
  user?: AuthUser;
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

void ensureSupportExtensions().catch((error) => {
  console.error("Failed to prepare SQL support extensions", error);
});

const unauthorized = (res: Response, message = "Unauthorized") =>
  res.status(401).json({ success: false, message });

const forbidden = (res: Response, message = "Access denied") =>
  res.status(403).json({ success: false, message });

const normalizeRole = (role?: string) => {
  const normalized = String(role ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

  if (normalized === "SUPERADMIN") return "SUPER_ADMIN";
  if (normalized === "HR_MANAGER" || normalized === "HR") return "HR_ADMIN";

  return normalized;
};

const issueTokens = (user: Pick<AuthUser, "Emp_id" | "username" | "role">) => {
  const accessSecret = process.env.JWT_SECRET || "local-dev-secret";
  const refreshSecret = process.env.JWT_REFRESH_SECRET || "local-dev-refresh-secret";
  const payload = {
    Emp_id: user.Emp_id,
    username: user.username,
    role: normalizeRole(user.role),
  };

  return {
    accessToken: jwt.sign(payload, accessSecret, { expiresIn: "15m" }),
    refreshToken: jwt.sign(payload, refreshSecret, { expiresIn: "7d" }),
  };
};

const comparePassword = async (password: string, passwordHash: string) => {
  if (passwordHash.startsWith("$2")) {
    return bcrypt.compare(password, passwordHash);
  }

  return password === passwordHash;
};

const toApiEmployee = (row: any) => ({
  id: row.Emp_id,
  Emp_id: row.Emp_id,
  username: row.username,
  name: row.name,
  company_email: row.company_email,
  personal_email: row.personal_email,
  email: row.company_email,
  role_name: normalizeRole(row.role_name),
  department_name: row.department_name,
  employee_status: row.employee_status,
  designation: row.designation,
  work_mode: row.work_mode,
  manager_id: row.manager_id,
  location: row.location,
  phone: row.phone,
  salary: row.salary,
  experience: row.experience,
  joining_date: row.joining_date,
  emergency_contact: row.emergency_contact,
  DOB: row.DOB,
  Gender: row.Gender,
  employment_type: row.employment_type,
  role_id: row.role_id,
  department_id: row.department_id,
});

const buildEmployeeSelect = `
  SELECT
    e.employee_id,
    e.emp_code AS Emp_id,
    u.username,
    e.employee_name AS name,
    e.email AS company_email,
    e.email AS personal_email,
    ISNULL(r.role_name, 'EMPLOYEE') AS role_name,
    d.department_name,
    CASE WHEN e.status = 'Active' THEN 'active' ELSE 'inactive' END AS employee_status,
    des.designation_name AS designation,
    ISNULL(att.attendance_type, 'Office') AS work_mode,
    mgr.emp_code AS manager_id,
    COALESCE(
      NULLIF(
        LTRIM(RTRIM(
          CONCAT(
            ISNULL(addr.city, ''),
            CASE WHEN addr.state IS NOT NULL AND addr.state <> '' THEN ', ' + addr.state ELSE '' END,
            CASE WHEN addr.country IS NOT NULL AND addr.country <> '' THEN ', ' + addr.country ELSE '' END
          )
        )),
        ''
      ),
      'India'
    ) AS location,
    e.phone,
    ISNULL(pay.basic_salary, 0) AS salary,
    CASE
      WHEN e.joining_date IS NULL THEN 0
      ELSE DATEDIFF(YEAR, e.joining_date, GETDATE())
    END AS experience,
    e.joining_date,
    e.emergency_contact,
    e.dob AS DOB,
    e.gender AS Gender,
    e.employment_type,
    u.role_id,
    e.department_id
  FROM dbo.Employee e
  LEFT JOIN dbo.Users u ON u.employee_id = e.employee_id
  LEFT JOIN dbo.RoleMaster r ON r.role_id = u.role_id
  LEFT JOIN dbo.Department d ON d.department_id = e.department_id
  LEFT JOIN dbo.Designation des ON des.designation_id = e.designation_id
  LEFT JOIN dbo.Employee mgr ON mgr.employee_id = e.manager_id
  LEFT JOIN dbo.Employee_Address addr ON addr.employee_id = e.employee_id
  OUTER APPLY (
    SELECT TOP 1 attendance_type
    FROM dbo.Attendance a
    WHERE a.employee_id = e.employee_id
    ORDER BY a.attendance_date DESC, a.attendance_id DESC
  ) att
  OUTER APPLY (
    SELECT TOP 1 basic_salary
    FROM dbo.Payroll p
    WHERE p.employee_id = e.employee_id
    ORDER BY p.pay_year DESC, p.pay_month DESC
  ) pay
`;

const getDbUserByEmpCode = async (empCode: string) => {
  const pool = await db;
  const result = await pool
    .request()
    .input("empCode", sql.VarChar, empCode)
    .query(`
      SELECT TOP 1
        e.employee_id,
        e.emp_code AS Emp_id,
        u.username,
        e.employee_name AS name,
        e.email,
        e.manager_id,
        ISNULL(r.role_name, 'EMPLOYEE') AS role_name
      FROM dbo.Employee e
      LEFT JOIN dbo.Users u ON u.employee_id = e.employee_id
      LEFT JOIN dbo.RoleMaster r ON r.role_id = u.role_id
      WHERE e.emp_code = @empCode
    `);

  return result.recordset[0] ?? null;
};

const authenticate = async (
  req: SqlAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return unauthorized(res, "Access token required");
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "local-dev-secret",
    ) as {
      Emp_id: string;
      username: string;
      role: string;
    };

    const user = await getDbUserByEmpCode(decoded.Emp_id);

    if (!user) {
      return unauthorized(res, "Employee not found");
    }

    req.user = {
      employeeId: user.employee_id,
      Emp_id: user.Emp_id,
      username: user.username,
      role: normalizeRole(user.role_name),
      name: user.name,
      email: user.email,
      managerEmployeeId: user.manager_id,
    };

    next();
  } catch (_error) {
    return unauthorized(res, "Invalid or expired token");
  }
};

const authorize =
  (...roles: string[]) =>
  (req: SqlAuthRequest, res: Response, next: NextFunction) => {
    const userRole = normalizeRole(req.user?.role);

    if (!userRole) {
      return unauthorized(res);
    }

    if (userRole === "SUPER_ADMIN" || roles.map(normalizeRole).includes(userRole)) {
      return next();
    }

    return forbidden(res, "Insufficient permissions");
  };

const canAccessEmployee =
  (paramKey = "empId") =>
  async (req: SqlAuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return unauthorized(res);
    }

    const targetEmpId = String(
      req.params[paramKey] ?? req.params.Emp_id ?? req.body.empId ?? req.user.Emp_id,
    );

    const userRole = normalizeRole(req.user.role);

    if (userRole === "SUPER_ADMIN" || userRole === "HR_ADMIN") {
      return next();
    }

    if (req.user.Emp_id === targetEmpId) {
      return next();
    }

    if (userRole === "MANAGER") {
      const pool = await db;
      const result = await pool
        .request()
        .input("targetEmpId", sql.VarChar, targetEmpId)
        .input("managerEmployeeId", sql.Int, req.user.employeeId)
        .query(`
          SELECT 1
          FROM dbo.Employee
          WHERE emp_code = @targetEmpId
            AND manager_id = @managerEmployeeId
        `);

      if (result.recordset.length > 0) {
        return next();
      }
    }

    return forbidden(res, "You can only access your own or team data");
  };

const getOrCreateDesignationId = async (name: string) => {
  const pool = await db;
  const trimmed = name.trim() || "Employee";
  const existing = await pool
    .request()
    .input("name", sql.VarChar, trimmed)
    .query(`
      SELECT TOP 1 designation_id
      FROM dbo.Designation
      WHERE designation_name = @name
    `);

  if (existing.recordset[0]) {
    return existing.recordset[0].designation_id as number;
  }

  const inserted = await pool
    .request()
    .input("name", sql.VarChar, trimmed)
    .query(`
      INSERT INTO dbo.Designation (designation_name, description)
      OUTPUT INSERTED.designation_id
      VALUES (@name, @name)
    `);

  return inserted.recordset[0].designation_id as number;
};

const resolveDepartmentId = async (input: unknown) => {
  if (input === undefined || input === null || input === "") return null;

  const pool = await db;
  const request = pool.request();
  const numeric = Number(input);

  if (Number.isFinite(numeric) && numeric > 0) {
    const found = await request.input("id", sql.Int, numeric).query(`
      SELECT TOP 1 department_id
      FROM dbo.Department
      WHERE department_id = @id
    `);
    return found.recordset[0]?.department_id ?? null;
  }

  const found = await request.input("name", sql.VarChar, String(input)).query(`
    SELECT TOP 1 department_id
    FROM dbo.Department
    WHERE department_name = @name OR department_code = @name
  `);
  return found.recordset[0]?.department_id ?? null;
};

const resolveRoleId = async (input: unknown) => {
  if (input === undefined || input === null || input === "") return null;

  const pool = await db;
  const request = pool.request();
  const numeric = Number(input);

  if (Number.isFinite(numeric) && numeric > 0) {
    const found = await request.input("id", sql.Int, numeric).query(`
      SELECT TOP 1 role_id
      FROM dbo.RoleMaster
      WHERE role_id = @id
    `);
    return found.recordset[0]?.role_id ?? null;
  }

  const normalized = normalizeRole(String(input));
  const found = await request.input("name", sql.VarChar, normalized).query(`
    SELECT TOP 1 role_id
    FROM dbo.RoleMaster
    WHERE role_name = @name
  `);
  return found.recordset[0]?.role_id ?? null;
};

const resolveEmployeeId = async (input: unknown) => {
  if (input === undefined || input === null || input === "") return null;

  const pool = await db;
  const request = pool.request();
  const numeric = Number(input);

  if (Number.isFinite(numeric) && numeric > 0) {
    const found = await request.input("id", sql.Int, numeric).query(`
      SELECT TOP 1 employee_id
      FROM dbo.Employee
      WHERE employee_id = @id
    `);
    return found.recordset[0]?.employee_id ?? null;
  }

  const found = await request.input("empCode", sql.VarChar, String(input)).query(`
    SELECT TOP 1 employee_id
    FROM dbo.Employee
    WHERE emp_code = @empCode OR employee_name = @empCode OR email = @empCode
  `);
  return found.recordset[0]?.employee_id ?? null;
};

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "username and password are required" });
  }

  await ensureSupportExtensions();

  const pool = await db;
  const result = await pool
    .request()
    .input("username", sql.VarChar, String(username))
    .query(`
      SELECT TOP 1
        e.employee_id,
        e.emp_code AS Emp_id,
        e.employee_name AS name,
        e.email,
        u.username,
        u.password_hash,
        ISNULL(r.role_name, 'EMPLOYEE') AS role_name
      FROM dbo.Users u
      INNER JOIN dbo.Employee e ON e.employee_id = u.employee_id
      LEFT JOIN dbo.RoleMaster r ON r.role_id = u.role_id
      WHERE u.username = @username
         OR e.email = @username
         OR e.emp_code = @username
    `);

  const user = result.recordset[0];

  if (!user || !(await comparePassword(String(password), user.password_hash))) {
    return unauthorized(res, "Invalid username or password");
  }

  const role = normalizeRole(user.role_name);
  const tokens = issueTokens({
    Emp_id: user.Emp_id,
    username: user.username,
    role,
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    ...tokens,
    user: {
      Emp_id: user.Emp_id,
      username: user.username,
      name: user.name,
      email: user.email,
      role,
    },
  });
});

authRouter.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body ?? {};

  if (!refreshToken) {
    return res.status(400).json({ success: false, message: "refreshToken is required" });
  }

  try {
    const decoded = jwt.verify(
      String(refreshToken),
      process.env.JWT_REFRESH_SECRET || "local-dev-refresh-secret",
    ) as {
      Emp_id: string;
      username: string;
      role: string;
    };

    const user = await getDbUserByEmpCode(decoded.Emp_id);
    if (!user) {
      return unauthorized(res, "Employee not found");
    }

    return res.status(200).json({
      success: true,
      ...issueTokens({
        Emp_id: user.Emp_id,
        username: user.username,
        role: normalizeRole(user.role_name),
      }),
    });
  } catch (_error) {
    return unauthorized(res, "Invalid refresh token");
  }
});

for (const routePath of [
  "/register",
  "/forgot-password",
  "/reset-password",
  "/send-email-verification",
  "/verify-email",
]) {
  authRouter.post(routePath, (_req, res) => {
    res.status(200).json({
      success: true,
      message: "SQL integration mode: endpoint accepted for future extension.",
    });
  });
}

employeeRouter.get("/", authenticate, authorize("SUPER_ADMIN", "HR_ADMIN", "MANAGER"), async (req: SqlAuthRequest, res) => {
  const pool = await db;
  const search = String(req.query.search ?? "").trim();
  const department = String(req.query.department ?? "").trim();
  const role = normalizeRole(String(req.query.role ?? ""));
  const status = String(req.query.status ?? "").trim().toLowerCase();

  const request = pool.request()
    .input("search", sql.VarChar, search || null)
    .input("department", sql.VarChar, department || null)
    .input("role", sql.VarChar, role || null)
    .input("status", sql.VarChar, status || null);

  let managerClause = "";
  if (normalizeRole(req.user?.role) === "MANAGER") {
    request.input("managerEmployeeId", sql.Int, req.user?.employeeId ?? null);
    managerClause = "AND e.manager_id = @managerEmployeeId";
  }

  const result = await request.query(`
    ${buildEmployeeSelect}
    WHERE (@search IS NULL
      OR e.employee_name LIKE '%' + @search + '%'
      OR e.emp_code LIKE '%' + @search + '%'
      OR e.email LIKE '%' + @search + '%')
      AND (@department IS NULL OR d.department_name = @department)
      AND (@role IS NULL OR ISNULL(r.role_name, 'EMPLOYEE') = @role)
      AND (@status IS NULL OR LOWER(CASE WHEN e.status = 'Active' THEN 'active' ELSE 'inactive' END) = @status)
      ${managerClause}
    ORDER BY e.employee_id DESC
  `);

  const employees = result.recordset.map(toApiEmployee);

  return res.status(200).json({
    success: true,
    message: "Employees fetched successfully",
    data: employees,
    pagination: {
      total: employees.length,
      page: 1,
      limit: employees.length || 1,
      totalPages: 1,
    },
  });
});

employeeRouter.get("/:empId", authenticate, canAccessEmployee("empId"), async (req: SqlAuthRequest, res) => {
  const pool = await db;
  const result = await pool.request().input("empId", sql.VarChar, req.params.empId).query(`
    ${buildEmployeeSelect}
    WHERE e.emp_code = @empId
  `);

  const employee = result.recordset[0];

  if (!employee) {
    return res.status(404).json({ success: false, message: "Employee not found" });
  }

  return res.status(200).json({ success: true, employee: toApiEmployee(employee) });
});

employeeRouter.post("/", authenticate, authorize("SUPER_ADMIN", "HR_ADMIN"), async (req: SqlAuthRequest, res) => {
  const pool = await db;
  const tx = new sql.Transaction(pool);

  await tx.begin();

  try {
    const departmentId = await resolveDepartmentId(req.body.department_id ?? req.body.Department_id ?? req.body.department_name ?? req.body.department);
    const roleId = (await resolveRoleId(req.body.role_id ?? req.body.RoleID ?? req.body.role_name ?? req.body.role)) ?? (await resolveRoleId("EMPLOYEE"));
    const managerId = await resolveEmployeeId(req.body.manager_id);
    const designationId = await getOrCreateDesignationId(String(req.body.designation ?? "Employee"));

    if (!departmentId) {
      throw new Error("Valid department is required");
    }

    if (!roleId) {
      throw new Error("Valid role is required");
    }

    const nextCodeResult = await new sql.Request(tx).query(`
      SELECT
        'EMP' + RIGHT('000' + CAST(ISNULL(MAX(TRY_CAST(SUBSTRING(emp_code, 4, 10) AS INT)), 0) + 1 AS VARCHAR(10)), 3) AS next_emp_code
      FROM dbo.Employee
    `);

    const empCode = nextCodeResult.recordset[0].next_emp_code as string;
    const email = String(req.body.personal_email ?? req.body.email ?? `${empCode.toLowerCase()}@company.com`);
    const username = String(req.body.username ?? req.body.name ?? empCode).toLowerCase().replace(/\s+/g, "");
    const passwordHash = await bcrypt.hash(String(req.body.password ?? "Password@123"), 10);
    const employmentType = String(req.body.employment_type ?? "Full-Time").replace(/_/g, "-");
    const employeeStatus = String(req.body.employee_status ?? "active").toLowerCase() === "active" ? "Active" : "Terminated";

    const employeeInsert = await new sql.Request(tx)
      .input("empCode", sql.VarChar, empCode)
      .input("employeeName", sql.VarChar, String(req.body.name ?? username))
      .input("email", sql.VarChar, email)
      .input("phone", sql.VarChar, String(req.body.phone ?? "9999999999"))
      .input("departmentId", sql.Int, departmentId)
      .input("designationId", sql.Int, designationId)
      .input("managerId", sql.Int, managerId)
      .input("joiningDate", sql.Date, String(req.body.joining_date ?? new Date().toISOString().slice(0, 10)))
      .input("employmentType", sql.VarChar, employmentType)
      .input("status", sql.VarChar, employeeStatus)
      .input("dob", sql.Date, req.body.DOB ?? null)
      .input("gender", sql.VarChar, req.body.Gender ?? null)
      .input("emergencyContact", sql.VarChar, req.body.emergency_contact ?? null)
      .query(`
        INSERT INTO dbo.Employee (
          emp_code,
          employee_name,
          email,
          phone,
          department_id,
          designation_id,
          manager_id,
          joining_date,
          employment_type,
          status,
          dob,
          gender,
          emergency_contact
        )
        OUTPUT INSERTED.employee_id
        VALUES (
          @empCode,
          @employeeName,
          @email,
          @phone,
          @departmentId,
          @designationId,
          @managerId,
          @joiningDate,
          @employmentType,
          @status,
          @dob,
          @gender,
          @emergencyContact
        )
      `);

    const employeeId = employeeInsert.recordset[0].employee_id as number;

    await new sql.Request(tx)
      .input("employeeId", sql.Int, employeeId)
      .input("username", sql.VarChar, username)
      .input("passwordHash", sql.VarChar, passwordHash)
      .input("roleId", sql.Int, roleId)
      .query(`
        INSERT INTO dbo.Users (employee_id, username, password_hash, role_id)
        VALUES (@employeeId, @username, @passwordHash, @roleId)
      `);

    await tx.commit();

    const created = await pool.request().input("empId", sql.VarChar, empCode).query(`
      ${buildEmployeeSelect}
      WHERE e.emp_code = @empId
    `);

    return res.status(201).json({ success: true, data: toApiEmployee(created.recordset[0]) });
  } catch (error: any) {
    await tx.rollback();
    return res.status(400).json({ success: false, message: error.message || "Unable to create employee" });
  }
});

employeeRouter.put("/:empId", authenticate, canAccessEmployee("empId"), async (req: SqlAuthRequest, res) => {
  const pool = await db;
  const existing = await pool.request().input("empId", sql.VarChar, req.params.empId).query(`
    SELECT TOP 1 employee_id
    FROM dbo.Employee
    WHERE emp_code = @empId
  `);

  const employeeId = existing.recordset[0]?.employee_id as number | undefined;
  if (!employeeId) {
    return res.status(404).json({ success: false, message: "Employee not found" });
  }

  const tx = new sql.Transaction(pool);
  await tx.begin();

  try {
    if (
      req.body.name !== undefined ||
      req.body.personal_email !== undefined ||
      req.body.email !== undefined ||
      req.body.phone !== undefined ||
      req.body.employee_status !== undefined ||
      req.body.designation !== undefined ||
      req.body.manager_id !== undefined ||
      req.body.department !== undefined ||
      req.body.department_id !== undefined ||
      req.body.Department_id !== undefined ||
      req.body.DOB !== undefined ||
      req.body.Gender !== undefined ||
      req.body.emergency_contact !== undefined ||
      req.body.employment_type !== undefined
    ) {
      const designationId = req.body.designation !== undefined
        ? await getOrCreateDesignationId(String(req.body.designation))
        : null;
      const departmentId = req.body.department !== undefined || req.body.department_id !== undefined || req.body.Department_id !== undefined
        ? await resolveDepartmentId(req.body.department_id ?? req.body.Department_id ?? req.body.department)
        : null;
      const managerId = req.body.manager_id !== undefined ? await resolveEmployeeId(req.body.manager_id) : null;
      const employeeStatus = req.body.employee_status !== undefined
        ? (String(req.body.employee_status).toLowerCase() === "active" ? "Active" : "Terminated")
        : null;
      const employmentType = req.body.employment_type !== undefined
        ? String(req.body.employment_type).replace(/_/g, "-")
        : null;

      await new sql.Request(tx)
        .input("employeeId", sql.Int, employeeId)
        .input("name", sql.VarChar, req.body.name ?? null)
        .input("email", sql.VarChar, req.body.personal_email ?? req.body.email ?? null)
        .input("phone", sql.VarChar, req.body.phone ?? null)
        .input("departmentId", sql.Int, departmentId)
        .input("designationId", sql.Int, designationId)
        .input("managerId", sql.Int, managerId)
        .input("status", sql.VarChar, employeeStatus)
        .input("dob", sql.Date, req.body.DOB ?? null)
        .input("gender", sql.VarChar, req.body.Gender ?? null)
        .input("emergencyContact", sql.VarChar, req.body.emergency_contact ?? null)
        .input("employmentType", sql.VarChar, employmentType)
        .query(`
          UPDATE dbo.Employee
          SET
            employee_name = COALESCE(@name, employee_name),
            email = COALESCE(@email, email),
            phone = COALESCE(@phone, phone),
            department_id = COALESCE(@departmentId, department_id),
            designation_id = COALESCE(@designationId, designation_id),
            manager_id = COALESCE(@managerId, manager_id),
            status = COALESCE(@status, status),
            dob = COALESCE(@dob, dob),
            gender = COALESCE(@gender, gender),
            emergency_contact = COALESCE(@emergencyContact, emergency_contact),
            employment_type = COALESCE(@employmentType, employment_type)
          WHERE employee_id = @employeeId
        `);
    }

    if (req.body.role !== undefined || req.body.role_name !== undefined || req.body.role_id !== undefined) {
      const roleId = await resolveRoleId(req.body.role_id ?? req.body.role_name ?? req.body.role);
      if (roleId) {
        await new sql.Request(tx)
          .input("employeeId", sql.Int, employeeId)
          .input("roleId", sql.Int, roleId)
          .query(`
            UPDATE dbo.Users
            SET role_id = @roleId
            WHERE employee_id = @employeeId
          `);
      }
    }

    await tx.commit();

    const updated = await pool.request().input("empId", sql.VarChar, req.params.empId).query(`
      ${buildEmployeeSelect}
      WHERE e.emp_code = @empId
    `);

    return res.status(200).json({ success: true, data: toApiEmployee(updated.recordset[0]) });
  } catch (error: any) {
    await tx.rollback();
    return res.status(400).json({ success: false, message: error.message || "Unable to update employee" });
  }
});

departmentRouter.get("/", authenticate, authorize("SUPER_ADMIN", "HR_ADMIN"), async (_req, res) => {
  const pool = await db;
  const result = await pool.request().query(`
    SELECT
      d.department_id AS DepartmentId,
      d.department_name AS DepartmentName,
      d.department_code AS DepartmentCode,
      ISNULL(m.employee_name, '') AS DepartmentHead,
      ISNULL(r.role_name, '') AS HeadRole,
      CAST(NULL AS VARCHAR(100)) AS ParentDepartment,
      'India' AS Location,
      'ACTIVE' AS Status,
      COUNT(e.employee_id) AS EmployeeCount
    FROM dbo.Department d
    LEFT JOIN dbo.Employee m ON m.employee_id = d.manager_id
    LEFT JOIN dbo.Users mu ON mu.employee_id = m.employee_id
    LEFT JOIN dbo.RoleMaster r ON r.role_id = mu.role_id
    LEFT JOIN dbo.Employee e ON e.department_id = d.department_id
    GROUP BY d.department_id, d.department_name, d.department_code, m.employee_name, r.role_name
    ORDER BY d.department_name
  `);

  return res.status(200).json({ success: true, data: result.recordset });
});

departmentRouter.post("/", authenticate, authorize("SUPER_ADMIN", "HR_ADMIN"), async (req, res) => {
  const pool = await db;
  const code = String(req.body.code ?? req.body.DepartmentCode ?? req.body.name ?? "DEP")
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase()
    .slice(0, 20) || `DEP${Date.now()}`;
  const managerId = await resolveEmployeeId(req.body.head ?? req.body.manager ?? req.body.DepartmentHead);

  const inserted = await pool.request()
    .input("name", sql.VarChar, String(req.body.name ?? req.body.DepartmentName ?? "Department"))
    .input("code", sql.VarChar, code)
    .input("managerId", sql.Int, managerId)
    .query(`
      INSERT INTO dbo.Department (department_name, department_code, manager_id)
      OUTPUT INSERTED.department_id AS DepartmentId
      VALUES (@name, @code, @managerId)
    `);

  const departmentId = inserted.recordset[0].DepartmentId as number;
  const result = await pool.request().input("departmentId", sql.Int, departmentId).query(`
    SELECT
      d.department_id AS DepartmentId,
      d.department_name AS DepartmentName,
      d.department_code AS DepartmentCode,
      ISNULL(m.employee_name, '') AS DepartmentHead,
      ISNULL(r.role_name, '') AS HeadRole,
      CAST(NULL AS VARCHAR(100)) AS ParentDepartment,
      'India' AS Location,
      'ACTIVE' AS Status,
      0 AS EmployeeCount
    FROM dbo.Department d
    LEFT JOIN dbo.Employee m ON m.employee_id = d.manager_id
    LEFT JOIN dbo.Users mu ON mu.employee_id = m.employee_id
    LEFT JOIN dbo.RoleMaster r ON r.role_id = mu.role_id
    WHERE d.department_id = @departmentId
  `);

  return res.status(201).json({ success: true, data: result.recordset[0] });
});

departmentRouter.put("/:departmentId", authenticate, authorize("SUPER_ADMIN", "HR_ADMIN"), async (req, res) => {
  const pool = await db;
  const managerId = await resolveEmployeeId(req.body.head ?? req.body.manager ?? req.body.DepartmentHead);

  await pool.request()
    .input("departmentId", sql.Int, Number(req.params.departmentId))
    .input("name", sql.VarChar, req.body.name ?? req.body.DepartmentName ?? null)
    .input("code", sql.VarChar, req.body.code ?? req.body.DepartmentCode ?? null)
    .input("managerId", sql.Int, managerId)
    .query(`
      UPDATE dbo.Department
      SET
        department_name = COALESCE(@name, department_name),
        department_code = COALESCE(@code, department_code),
        manager_id = COALESCE(@managerId, manager_id)
      WHERE department_id = @departmentId
    `);

  const result = await pool.request().input("departmentId", sql.Int, Number(req.params.departmentId)).query(`
    SELECT
      d.department_id AS DepartmentId,
      d.department_name AS DepartmentName,
      d.department_code AS DepartmentCode,
      ISNULL(m.employee_name, '') AS DepartmentHead,
      ISNULL(r.role_name, '') AS HeadRole,
      CAST(NULL AS VARCHAR(100)) AS ParentDepartment,
      'India' AS Location,
      'ACTIVE' AS Status,
      COUNT(e.employee_id) AS EmployeeCount
    FROM dbo.Department d
    LEFT JOIN dbo.Employee m ON m.employee_id = d.manager_id
    LEFT JOIN dbo.Users mu ON mu.employee_id = m.employee_id
    LEFT JOIN dbo.RoleMaster r ON r.role_id = mu.role_id
    LEFT JOIN dbo.Employee e ON e.department_id = d.department_id
    WHERE d.department_id = @departmentId
    GROUP BY d.department_id, d.department_name, d.department_code, m.employee_name, r.role_name
  `);

  return res.status(200).json({ success: true, data: result.recordset[0] });
});

roleRouter.get("/", authenticate, authorize("SUPER_ADMIN", "HR_ADMIN"), async (_req, res) => {
  const pool = await db;
  const result = await pool.request().query(`
    SELECT
      r.role_id AS RoleId,
      r.role_name AS RoleName,
      ISNULL(r.permissions, '') AS Description,
      'ACTIVE' AS Status,
      COUNT(u.user_id) AS EmployeeCount
    FROM dbo.RoleMaster r
    LEFT JOIN dbo.Users u ON u.role_id = r.role_id
    GROUP BY r.role_id, r.role_name, r.permissions
    ORDER BY r.role_name
  `);

  return res.status(200).json({ success: true, data: result.recordset });
});

holidayRouter.get("/all", authenticate, async (_req, res) => {
  const pool = await db;
  const result = await pool.request().query(`
    SELECT
      holiday_id AS HolidayId,
      holiday_name AS HolidayName,
      holiday_date AS HolidayDate,
      'India' AS Region,
      ISNULL(description, 'public') AS Type,
      1 AS client_id
    FROM dbo.Holiday
    ORDER BY holiday_date ASC
  `);

  return res.status(200).json({ success: true, data: result.recordset });
});

holidayRouter.post("/add", authenticate, authorize("SUPER_ADMIN", "HR_ADMIN"), async (req, res) => {
  const pool = await db;
  const inserted = await pool.request()
    .input("name", sql.VarChar, String(req.body.holiday_name ?? "Holiday"))
    .input("date", sql.Date, String(req.body.holiday_date ?? new Date().toISOString().slice(0, 10)))
    .input("description", sql.VarChar, String(req.body.type ?? "public"))
    .query(`
      INSERT INTO dbo.Holiday (holiday_name, holiday_date, description)
      OUTPUT INSERTED.holiday_id AS HolidayId
      VALUES (@name, @date, @description)
    `);

  return res.status(201).json({
    success: true,
    message: "Holiday created successfully",
    data: {
      HolidayId: inserted.recordset[0].HolidayId,
      HolidayName: req.body.holiday_name ?? "Holiday",
      HolidayDate: req.body.holiday_date ?? new Date().toISOString().slice(0, 10),
      Region: "India",
      Type: req.body.type ?? "public",
      client_id: 1,
    },
  });
});

leaveRouter.get("/all", authenticate, async (req: SqlAuthRequest, res) => {
  const pool = await db;
  const request = pool.request()
    .input("employeeId", sql.Int, req.user?.employeeId ?? null)
    .input("role", sql.VarChar, normalizeRole(req.user?.role));

  let filter = "";
  if (normalizeRole(req.user?.role) === "MANAGER") {
    filter = "WHERE e.manager_id = @employeeId OR lr.employee_id = @employeeId";
  } else if (!["SUPER_ADMIN", "HR_ADMIN"].includes(normalizeRole(req.user?.role))) {
    filter = "WHERE lr.employee_id = @employeeId";
  }

  const result = await request.query(`
    SELECT
      lr.leave_id AS LeaveId,
      e.emp_code AS Emp_id,
      e.employee_name AS EmployeeName,
      lt.leave_name AS LeaveType,
      lr.start_date AS FromDate,
      lr.end_date AS ToDate,
      DATEDIFF(DAY, lr.start_date, lr.end_date) + 1 AS TotalDays,
      lr.reason AS Reason,
      lr.status AS Status,
      lr.applied_at AS RequestedAt
    FROM dbo.Leave_Request lr
    INNER JOIN dbo.Employee e ON e.employee_id = lr.employee_id
    INNER JOIN dbo.Leave_Type lt ON lt.leave_type_id = lr.leave_type_id
    ${filter}
    ORDER BY lr.applied_at DESC
  `);

  return res.status(200).json({ success: true, data: result.recordset });
});

leaveRouter.post("/apply", authenticate, async (req: SqlAuthRequest, res) => {
  const pool = await db;
  const leaveName = String(req.body.leave_type ?? "Annual Leave");
  let leaveTypeId = (await pool.request().input("leaveName", sql.VarChar, leaveName).query(`
    SELECT TOP 1 leave_type_id
    FROM dbo.Leave_Type
    WHERE leave_name = @leaveName
  `)).recordset[0]?.leave_type_id as number | undefined;

  if (!leaveTypeId) {
    const inserted = await pool.request()
      .input("leaveName", sql.VarChar, leaveName)
      .query(`
        INSERT INTO dbo.Leave_Type (leave_name, max_days)
        OUTPUT INSERTED.leave_type_id
        VALUES (@leaveName, 12)
      `);
    leaveTypeId = inserted.recordset[0].leave_type_id as number;
  }

  await pool.request()
    .input("employeeId", sql.Int, req.user?.employeeId ?? null)
    .input("leaveTypeId", sql.Int, leaveTypeId)
    .input("startDate", sql.Date, String(req.body.from_date))
    .input("endDate", sql.Date, String(req.body.to_date))
    .input("reason", sql.VarChar, String(req.body.reason ?? ""))
    .query(`
      INSERT INTO dbo.Leave_Request (employee_id, leave_type_id, start_date, end_date, reason, status)
      VALUES (@employeeId, @leaveTypeId, @startDate, @endDate, @reason, 'Pending')
    `);

  return res.status(201).json({ success: true, message: "Leave applied successfully" });
});

leaveRouter.put("/status/:Emp_id", authenticate, authorize("SUPER_ADMIN", "HR_ADMIN", "MANAGER"), async (req: SqlAuthRequest, res) => {
  await db.then((pool) =>
    pool.request()
      .input("leaveId", sql.Int, Number(req.body.leave_id))
      .input("status", sql.VarChar, String(req.body.status).charAt(0).toUpperCase() + String(req.body.status).slice(1).toLowerCase())
      .input("approvedBy", sql.Int, req.user?.employeeId ?? null)
      .query(`
        UPDATE dbo.Leave_Request
        SET
          status = @status,
          approved_by = @approvedBy
        WHERE leave_id = @leaveId
      `),
  );

  return res.status(200).json({ success: true, message: "Leave status updated successfully" });
});

wfhRouter.post("/create", authenticate, async (req: SqlAuthRequest, res) => {
  await ensureSupportExtensions();
  const pool = await db;
  const inserted = await pool.request()
    .input("employeeId", sql.Int, req.user?.employeeId ?? null)
    .input("fromDate", sql.Date, String(req.body.from_date))
    .input("toDate", sql.Date, String(req.body.to_date))
    .input("reason", sql.VarChar, String(req.body.reason ?? ""))
    .query(`
      INSERT INTO dbo.WFH_Request (employee_id, from_date, to_date, reason)
      OUTPUT
        INSERTED.wfh_request_id AS Id,
        INSERTED.from_date AS FromDate,
        INSERTED.to_date AS ToDate,
        INSERTED.reason AS Reason,
        INSERTED.status AS Status,
        INSERTED.requested_at AS RequestedAt
      VALUES (@employeeId, @fromDate, @toDate, @reason)
    `);

  return res.status(201).json({
    success: true,
    message: "WFH request created successfully",
    data: inserted.recordset[0],
  });
});

wfhRouter.get("/all-requests", authenticate, async (req: SqlAuthRequest, res) => {
  await ensureSupportExtensions();
  const pool = await db;
  const request = pool.request().input("employeeId", sql.Int, req.user?.employeeId ?? null);

  let filter = "";
  if (normalizeRole(req.user?.role) === "MANAGER") {
    filter = "WHERE e.manager_id = @employeeId OR w.employee_id = @employeeId";
  } else if (!["SUPER_ADMIN", "HR_ADMIN"].includes(normalizeRole(req.user?.role))) {
    filter = "WHERE w.employee_id = @employeeId";
  }

  const result = await request.query(`
    SELECT
      w.wfh_request_id AS Id,
      e.emp_code AS Emp_id,
      e.employee_name AS EmployeeName,
      w.from_date AS FromDate,
      w.to_date AS ToDate,
      w.reason AS Reason,
      w.status AS Status,
      w.requested_at AS RequestedAt,
      w.rejection_reason AS RejectionReason
    FROM dbo.WFH_Request w
    INNER JOIN dbo.Employee e ON e.employee_id = w.employee_id
    ${filter}
    ORDER BY w.requested_at DESC
  `);

  return res.status(200).json({ success: true, data: result.recordset });
});

wfhRouter.put("/update-status/:empId", authenticate, authorize("SUPER_ADMIN", "HR_ADMIN", "MANAGER"), async (req: SqlAuthRequest, res) => {
  await ensureSupportExtensions();
  const pool = await db;
  const status = String(req.body.status ?? "Pending").charAt(0).toUpperCase() + String(req.body.status ?? "Pending").slice(1).toLowerCase();

  await pool.request()
    .input("empId", sql.VarChar, req.params.empId)
    .input("status", sql.VarChar, status)
    .input("approvedBy", sql.Int, req.user?.employeeId ?? null)
    .query(`
      ;WITH latest_request AS (
        SELECT TOP 1 w.wfh_request_id
        FROM dbo.WFH_Request w
        INNER JOIN dbo.Employee e ON e.employee_id = w.employee_id
        WHERE e.emp_code = @empId
        ORDER BY w.requested_at DESC
      )
      UPDATE w
      SET
        status = @status,
        approved_by = @approvedBy,
        rejection_reason = CASE WHEN @status = 'Rejected' THEN 'Rejected by approver' ELSE NULL END,
        updated_at = SYSDATETIME()
      FROM dbo.WFH_Request w
      INNER JOIN latest_request lr ON lr.wfh_request_id = w.wfh_request_id
    `);

  return res.status(200).json({ success: true, message: "WFH status updated successfully" });
});

attendanceRouter.post("/punch-in", authenticate, async (req: SqlAuthRequest, res) => {
  const pool = await db;
  const today = new Date();
  const attendanceDate = today.toISOString().slice(0, 10);
  const nowIso = today.toISOString();
  const hour = today.getHours();
  const minute = today.getMinutes();
  const isLate = hour > 9 || (hour === 9 && minute > 15);

  const existing = await pool.request()
    .input("employeeId", sql.Int, req.user?.employeeId ?? null)
    .input("attendanceDate", sql.Date, attendanceDate)
    .query(`
      SELECT TOP 1 attendance_id, punch_in, punch_out
      FROM dbo.Attendance
      WHERE employee_id = @employeeId
        AND attendance_date = @attendanceDate
    `);

  if (existing.recordset[0]?.punch_in && !existing.recordset[0]?.punch_out) {
    return res.status(409).json({ success: false, message: "Already punched in for today" });
  }

  if (existing.recordset[0]?.attendance_id) {
    await pool.request()
      .input("attendanceId", sql.Int, existing.recordset[0].attendance_id)
      .input("punchIn", sql.DateTime2, nowIso)
      .input("status", sql.VarChar, isLate ? "Late" : "Present")
      .query(`
        UPDATE dbo.Attendance
        SET punch_in = @punchIn, status = @status, attendance_type = 'Office'
        WHERE attendance_id = @attendanceId
      `);
  } else {
    await pool.request()
      .input("employeeId", sql.Int, req.user?.employeeId ?? null)
      .input("attendanceDate", sql.Date, attendanceDate)
      .input("punchIn", sql.DateTime2, nowIso)
      .input("status", sql.VarChar, isLate ? "Late" : "Present")
      .query(`
        INSERT INTO dbo.Attendance (employee_id, attendance_date, punch_in, status, attendance_type, late_minutes)
        VALUES (@employeeId, @attendanceDate, @punchIn, @status, 'Office', 0)
      `);
  }

  return res.status(200).json({
    success: true,
    message: "Punch in recorded successfully",
    punch_in_time: nowIso,
  });
});

attendanceRouter.post("/punch-out", authenticate, async (req: SqlAuthRequest, res) => {
  const pool = await db;
  const today = new Date().toISOString().slice(0, 10);
  const nowIso = new Date().toISOString();

  const result = await pool.request()
    .input("employeeId", sql.Int, req.user?.employeeId ?? null)
    .input("attendanceDate", sql.Date, today)
    .query(`
      SELECT TOP 1 attendance_id, punch_in
      FROM dbo.Attendance
      WHERE employee_id = @employeeId
        AND attendance_date = @attendanceDate
      ORDER BY attendance_id DESC
    `);

  const record = result.recordset[0];
  if (!record?.punch_in) {
    return res.status(404).json({ success: false, message: "No active punch-in found for today" });
  }

  const totalHours = Number(
    (((new Date(nowIso).getTime() - new Date(record.punch_in).getTime()) / 36e5)).toFixed(2),
  );

  await pool.request()
    .input("attendanceId", sql.Int, record.attendance_id)
    .input("punchOut", sql.DateTime2, nowIso)
    .input("workHours", sql.Decimal(5, 2), totalHours)
    .query(`
      UPDATE dbo.Attendance
      SET punch_out = @punchOut, work_hours = @workHours
      WHERE attendance_id = @attendanceId
    `);

  return res.status(200).json({
    success: true,
    message: "Punch out recorded successfully",
    punch_out_time: nowIso,
    total_hours: totalHours,
  });
});

attendanceRouter.get("/summary/:empId", authenticate, canAccessEmployee("empId"), async (req: SqlAuthRequest, res) => {
  const month = Number(req.query.month);
  const year = Number(req.query.year);

  const pool = await db;
  const result = await pool.request()
    .input("empId", sql.VarChar, req.params.empId)
    .input("month", sql.Int, month)
    .input("year", sql.Int, year)
    .query(`
      SELECT
        COUNT(*) AS total_days,
        SUM(CASE WHEN status IN ('Present', 'Late') THEN 1 ELSE 0 END) AS present_days,
        SUM(CASE WHEN attendance_type = 'WFH' THEN 1 ELSE 0 END) AS wfh_days,
        SUM(CASE WHEN punch_in IS NOT NULL AND punch_out IS NOT NULL THEN work_hours ELSE 0 END) AS total_hours
      FROM dbo.Attendance a
      INNER JOIN dbo.Employee e ON e.employee_id = a.employee_id
      WHERE e.emp_code = @empId
        AND MONTH(a.attendance_date) = @month
        AND YEAR(a.attendance_date) = @year
    `);

  return res.status(200).json({
    success: true,
    data: result.recordset[0] ?? {
      total_days: 0,
      present_days: 0,
      wfh_days: 0,
      total_hours: 0,
    },
  });
});

attendanceRouter.get("/dashboard", authenticate, authorize("SUPER_ADMIN", "HR_ADMIN", "MANAGER", "FINANCE"), async (_req, res) => {
  const pool = await db;
  const result = await pool.request().query(`
    SELECT
      COUNT(*) AS total_employees,
      SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) AS active_employees
    FROM dbo.Employee
  `);

  return res.status(200).json({ success: true, data: result.recordset[0] });
});

utilityRouter.get("/health/sql", async (_req, res) => {
  try {
    await ensureSupportExtensions();
    return res.status(200).json({ success: true, message: "SQL integration ready" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "SQL integration failed" });
  }
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
