import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export const getEmployees = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employees`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getEmployee = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employees/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createEmployee = async (employee: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/employees`, employee);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateEmployee = async (id: string, employee: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/employees/${id}`, employee);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/employees/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};