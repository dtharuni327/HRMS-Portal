# JSON to SQL Mapping

This document maps the integrated local JSON datastore schema in `backend/src/local/store.ts` to the original SQL Server schema from the `Support` branch.

Source SQL artifacts:

- `origin/Support:HRMS_FINAL_REVISED_FULLY_CORRECT.sql`
- `origin/Support:HRMS_SP.sql`

## employees

| JSON field | SQL table.column | Note |
| --- | --- | --- |
| `Emp_id` | `Employee.emp_code` | JSON business ID maps to employee code, not numeric PK `employee_id`. |
| `username` | `Users.username` | Login username comes from `Users`. |
| `password` | `Users.password_hash` | JSON stores plain demo password; SQL expects hashed password. |
| `name` | `Employee.employee_name` | Direct employee name mapping. |
| `company_email` | `Employee.email` | Support schema has one employee email field only. |
| `personal_email` | `Employee.email` | No separate personal email column in support SQL. |
| `role_name` | `RoleMaster.role_name` | Reached through `Users.role_id -> RoleMaster.role_id`. |
| `department_name` | `Department.department_name` | Reached through `Employee.department_id -> Department.department_id`. |
| `employee_status` | `Employee.status` | SQL uses values like `Active`, `Resigned`, `Terminated`; JSON uses simplified uppercase demo values. |
| `designation` | `Designation.designation_name` | Reached through `Employee.designation_id -> Designation.designation_id`. |
| `work_mode` | `Attendance.attendance_type` | No employee-level `work_mode` column in support SQL; JSON keeps this as a demo convenience field. |
| `manager_id` | `Employee.manager_id` | SQL stores numeric FK to `Employee.employee_id`; JSON stores business-style employee code. |
| `location` | `Employee_Address.city/state/country` | No single `location` column; JSON compresses address into one field. |
| `phone` | `Employee.phone` | Direct mapping. |
| `salary` | `Payroll.basic_salary` | Not an employee master column in support SQL; closest source is payroll. |
| `experience` | `No direct column` | Support schema does not define an experience field. |
| `joining_date` | `Employee.joining_date` | Direct mapping. |
| `emergency_contact` | `Employee.emergency_contact` | Direct mapping. |
| `DOB` | `Employee.dob` | Direct mapping. |
| `Gender` | `Employee.gender` | Direct mapping. |
| `employment_type` | `Employee.employment_type` | Direct mapping. |
| `profile_image` | `No direct column` | Support schema has no profile image column. |
| `client_id` | `No direct column on Employee` | `Client.client_id` exists, but support schema does not link employee directly to client. |
| `role_id` | `Users.role_id` | Direct role FK in `Users`. |
| `department_id` | `Employee.department_id` | Direct department FK in `Employee`. |
| `dashboard_id` | `No direct column` | Support schema has no dashboard reference. |

## departments

| JSON field | SQL table.column | Note |
| --- | --- | --- |
| `DepartmentId` | `Department.department_id` | Direct mapping. |
| `DepartmentName` | `Department.department_name` | Direct mapping. |
| `DepartmentCode` | `Department.department_code` | Direct mapping. |
| `DepartmentHead` | `Employee.employee_name` | Derived via `Department.manager_id -> Employee.employee_id`. |
| `HeadRole` | `RoleMaster.role_name` | Derived through manager's user record: `Department.manager_id -> Users.employee_id -> RoleMaster`. |
| `ParentDepartment` | `No direct column` | Support SQL `Department` has no parent department field. |
| `Location` | `No direct column` | Support SQL `Department` has no location field. |
| `Status` | `No direct column` | Support SQL `Department` has no status field. |

## roles

| JSON field | SQL table.column | Note |
| --- | --- | --- |
| `RoleId` | `RoleMaster.role_id` | Direct mapping. |
| `RoleName` | `RoleMaster.role_name` | Direct mapping. |
| `Description` | `RoleMaster.permissions` | Closest available SQL field; not a true description column. |
| `Status` | `No direct column` | Support SQL `RoleMaster` has no status field. |

## holidays

| JSON field | SQL table.column | Note |
| --- | --- | --- |
| `HolidayId` | `Holiday.holiday_id` | Direct mapping. |
| `HolidayName` | `Holiday.holiday_name` | Direct mapping. |
| `HolidayDate` | `Holiday.holiday_date` | Direct mapping. |
| `Region` | `No direct column` | Support SQL `Holiday` has no region field. |
| `Type` | `Holiday.description` | Closest possible mapping from table definition, but stored procedures suggest a missing `holiday_type` design mismatch. |
| `client_id` | `No direct column` | Support SQL `Holiday` has no client link. |

## leaves

| JSON field | SQL table.column | Note |
| --- | --- | --- |
| `LeaveId` | `Leave_Request.leave_id` | Direct mapping. |
| `Emp_id` | `Employee.emp_code` | Derived via `Leave_Request.employee_id -> Employee.employee_id`. |
| `EmployeeName` | `Employee.employee_name` | Derived via employee join. |
| `LeaveType` | `Leave_Type.leave_name` | Derived via `Leave_Request.leave_type_id -> Leave_Type.leave_type_id`. |
| `FromDate` | `Leave_Request.start_date` | Direct mapping. |
| `ToDate` | `Leave_Request.end_date` | Direct mapping. |
| `TotalDays` | `No direct column` | Derived from start/end dates in JSON. |
| `Reason` | `Leave_Request.reason` | Direct mapping. |
| `Status` | `Leave_Request.status` | Direct mapping. |
| `RequestedAt` | `Leave_Request.applied_at` | Direct mapping. |
| `RejectionReason` | `No direct column` | Support SQL leave request table has no rejection reason field. |

## wfhRequests

| JSON field | SQL table.column | Note |
| --- | --- | --- |
| `Id` | `No direct table/column` | Support schema has no WFH table. |
| `Emp_id` | `No direct table/column` | Would need a custom WFH table linked to employee. |
| `EmployeeName` | `No direct table/column` | Would be derived from employee join if WFH table existed. |
| `FromDate` | `No direct table/column` | No support-branch WFH schema. |
| `ToDate` | `No direct table/column` | No support-branch WFH schema. |
| `Reason` | `No direct table/column` | No support-branch WFH schema. |
| `Status` | `No direct table/column` | No support-branch WFH schema. |
| `RequestedAt` | `No direct table/column` | No support-branch WFH schema. |
| `RejectionReason` | `No direct table/column` | No support-branch WFH schema. |

## attendance

| JSON field | SQL table.column | Note |
| --- | --- | --- |
| `Emp_id` | `Employee.emp_code` | Derived via `Attendance.employee_id -> Employee.employee_id`. |
| `Date` | `Attendance.attendance_date` | Direct mapping. |
| `punch_in_time` | `Attendance.punch_in` | Direct mapping. |
| `punch_out_time` | `Attendance.punch_out` | Direct mapping. |
| `work_mode` | `Attendance.attendance_type` | Closest direct mapping. |
| `punch_in_status` | `No direct column` | Derived by app logic; support SQL does not store this separately. |
| `attendance_status` | `Attendance.status` | Direct mapping. |
| `total_hours` | `Attendance.work_hours` | Direct mapping. |

## Summary

- Directly backed by SQL tables: `employees`, `departments`, `roles`, `holidays`, `leaves`, `attendance`
- Not backed in the `Support` schema: `wfhRequests`
- Most flattened collection: `employees`
  It merges data that originally belongs across `Employee`, `Users`, `Department`, `Designation`, `RoleMaster`, `Payroll`, and `Employee_Address`.
