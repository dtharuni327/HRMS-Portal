export const LEAVE_MESSAGES = {
  LEAVE_APPLIED: "Leave applied successfully",
  LEAVE_UPDATED: "Leave updated successfully",
  LEAVE_DELETED: "Leave deleted successfully",
  LEAVES_FETCHED: "Leaves fetched successfully",
  LEAVE_FETCHED: "Leave fetched successfully",
  LEAVE_NOT_FOUND: "Leave not found",
  LEAVE_ALREADY_EXISTS: "Leave already exists",
  LEAVE_STATUS_UPDATED: "Leave status updated successfully",
  LEAVE_APPROVED: "Leave approved successfully",
  LEAVE_REJECTED: "Leave rejected successfully",
  LEAVE_CANCELLED: "Leave cancelled successfully",

  NOTIFICATIONS_FETCHED:
    "Leave notifications fetched successfully",
  NOTIFICATION_VISIBILITY_UPDATED:
    "Notification visibility updated successfully",

  /* Leave Type */
  LEAVE_TYPE_CREATED: "Leave type created successfully",
  LEAVE_TYPE_UPDATED: "Leave type updated successfully",
  LEAVE_TYPE_DELETED: "Leave type deleted successfully",
  LEAVE_TYPES_FETCHED: "Leave types fetched successfully",
  LEAVE_TYPE_NOT_FOUND: "Leave type not found",

  EMPLOYEE_ID_REQUIRED: "Employee Id is required",
  LEAVE_TYPE_REQUIRED: "Leave type is required",
  START_DATE_REQUIRED: "Start date is required",
  END_DATE_REQUIRED: "End date is required",
  REASON_REQUIRED: "Reason is required",
  STATUS_REQUIRED: "Status is required",

  INVALID_LEAVE_ID: "Invalid leave id",
  INVALID_LEAVE_TYPE_ID: "Invalid leave type id",

  UNAUTHORIZED: "Unauthorized",
  INTERNAL_SERVER_ERROR: "Internal server error"
};

export const LEAVE_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled"
};

export const LEAVE_TYPES = {
  CASUAL: "Casual Leave",
  SICK: "Sick Leave",
  EARNED: "Earned Leave",
  MATERNITY: "Maternity Leave",
  PATERNITY: "Paternity Leave",
  LOSS_OF_PAY: "Loss Of Pay"
};

export const LEAVE_API = {
  APPLY: "/apply",
  GET_ALL: "/all",
  UPDATE: "/update/:leave_id",
  DELETE: "/delete/:leave_id",
  APPROVE: "/approve/:leave_id",
  REJECT: "/reject/:leave_id",
  NOTIFICATIONS: "/notifications",
  VISIBILITY: "/visibility",

  /* Leave Type */
  ADD_LEAVE_TYPE: "/leave-type/add",
  GET_LEAVE_TYPES: "/leave-type/all",
  UPDATE_LEAVE_TYPE: "/leave-type/update/:id",
  DELETE_LEAVE_TYPE: "/leave-type/delete/:id"
};