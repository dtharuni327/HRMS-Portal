export const ROLE_MESSAGES = {
  ROLE_CREATED: "Role created successfully",
  ROLE_UPDATED: "Role updated successfully",
  ROLES_FETCHED: "Roles fetched successfully",
  ROLE_NOT_FOUND: "Role target tracking entity not found",
  ROLE_ALREADY_EXISTS: "Role already exists within this specific department",
  IDENTICAL_MAPPING_EXISTS: "Another identical job title role designation already mapped in this department",
  NAME_REQUIRED: "Role name is required",
  DEPT_ID_REQUIRED: "Valid Department ID is required",
  INVALID_ID: "Invalid role ID format",
  INVALID_DEPT_QUERY: "Department ID must be a valid number",
  UNAUTHORIZED: "Unauthorized",
  INTERNAL_SERVER_ERROR: "Internal server error"
};   

export const ROLE_API = {
  ADD: "/add",
  GET_ALL: "/all",
  UPDATE: "/update/:id"
};