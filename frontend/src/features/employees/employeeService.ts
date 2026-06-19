import axios from 'axios';
import { Employee, CreateEmployeeRequest } from './employeeTypes';
import { config } from "../../config/env";

const API_BASE_URL = config.API_BASE_URL;

export const getEmployees = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/employees`);
  return response.data;
};

export const getEmployee = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/employees/${id}`);
  return response.data;
};

export const createEmployee = async (employee: CreateEmployeeRequest) => {
  const response = await axios.post(`${API_BASE_URL}/api/employees`, employee);
  return response.data;
};

export const updateEmployee = async (id: string, employee: Partial<Employee>) => {
  const response = await axios.put(`${API_BASE_URL}/api/employees/${id}`, employee);
  return response.data;
};

export const deleteEmployee = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/api/employees/${id}`);
  return response.data;
};
