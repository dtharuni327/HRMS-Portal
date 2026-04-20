export interface Employee {
  id: number;
  name: string;
  role: string;
  salary: number;
}

export const employees: Employee[] = [
  { id: 1, name: "John", role: "Developer", salary: 50000 },
  { id: 2, name: "Sara", role: "Tester", salary: 40000 },
  { id: 3, name: "David", role: "Manager", salary: 70000 },
  { id: 4, name: "Priya", role: "HR", salary: 45000 },
  { id: 5, name: "Arun", role: "Developer", salary: 52000 },
  { id: 6, name: "Meena", role: "Designer", salary: 48000 },
  { id: 7, name: "Karthik", role: "DevOps Engineer", salary: 65000 },
  { id: 8, name: "Anjali", role: "Business Analyst", salary: 55000 },
  { id: 9, name: "Ravi", role: "Support Engineer", salary: 42000 },
  { id: 10, name: "Divya", role: "QA Engineer", salary: 46000 }
];