export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'inactive';
  managerId?: string;
  phone?: string;
  address?: string;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  hireDate: string;
  salary: number;
  phone?: string;
  address?: string;
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  status?: 'active' | 'inactive';
}

export interface EmployeeFilters {
  department?: string;
  status?: 'active' | 'inactive';
  search?: string;
}