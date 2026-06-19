# 🚀 HRMS Portal

A Human Resource Management System (HRMS) built with modern web technologies.

---

## ⚙️ Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Axios (API calls)
- Zustand / React Query (state management)
- JWT Authentication

---

## 📁 Project Structure
src/
│
├── assets/
│
├── components/
│ ├── ui/
│ ├── forms/
│ ├── layout/
│ ├── guards/
│
├── pages/
│ ├── auth/
│ ├── admin/
│ ├── hr/
│ ├── manager/
│ ├── employee/
│ ├── client/
│ ├── superadmin/
│
├── features/
│ ├── auth/
│ ├── employees/
│ ├── attendance/
│ ├── payroll/
│ ├── projects/
│
├── services/
├── hooks/
├── context/
├── routes/
├── store/
├── types/
├── utils/
├── config/
│
├── App.tsx
├── main.tsx



---

## 🚀 Getting Started



## Frontend Application (Without Backend or Mock Server)

Install dependencies:

```bash
npm install

## Prerequisites

Before starting the frontend application, ensure that the mock API server is running.

### Start Mock Server

Run the following command to start the mock backend server on port 5000:

```bash
npx json-server mock/users.json --port 5000