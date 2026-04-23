# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```



























Rk readme



1. Tech Stack (Recommended)
Frontend: React + TypeScript + Vite
Styling: Tailwind CSS
Routing: React Router
State: Zustand / React Query
API: Axios
Auth: JWT (backend)

2. Real HRMS Project Structure (Scalable)
src/
│
├── assets/                 # Images, icons, logos
│
├── components/            # Reusable UI components
│   ├── ui/                # Buttons, inputs, modals
│   ├── forms/            # Form components (login, employee form)
│   ├── layout/           # Sidebar, Navbar, Header
│   ├── guards/           # Route protection (RoleGuard)
│
├── pages/                # Route-level pages
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── ForgotPassword.tsx
│   │
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │
│   ├── hr/
│   │   ├── HRDashboard.tsx
│   │   ├── EmployeeManagement.tsx
│   │
│   ├── manager/
│   │   ├── ManagerDashboard.tsx
│   │   ├── TeamOverview.tsx
│   │
│   ├── employee/
│   │   ├── EmployeeDashboard.tsx
│   │   ├── MyAttendance.tsx
│   │
│   ├── client/
│   │   ├── ClientDashboard.tsx
│   │   ├── ProjectTracking.tsx
│   │
│   ├── superadmin/
│   │   ├── SuperAdminDashboard.tsx
│
├── features/             # Business logic modules (VERY IMPORTANT)
│   ├── auth/
│   │   ├── authSlice.ts
│   │   ├── authService.ts
│   │   ├── authAPI.ts
│   │
│   ├── employees/
│   │   ├── employeeAPI.ts
│   │   ├── employeeService.ts
│   │   ├── employeeTypes.ts
│   │
│   ├── attendance/
│   ├── payroll/
│   ├── projects/
│
├── services/             # API base configuration
│   ├── apiClient.ts      # Axios instance
│   ├── endpoints.ts      # Central API routes
│
├── hooks/                # Custom hooks
│   ├── useAuth.ts
│   ├── useRole.ts
│   ├── useFetch.ts
│
├── context/              # Global state (Auth context)
│   ├── AuthContext.tsx
│
├── routes/               # App routing
│   ├── AppRoutes.tsx
│   ├── ProtectedRoute.tsx
│   ├── RoleRoute.tsx
│
├── store/                # Zustand/Redux store
│   ├── authStore.ts
│
├── types/                # Global TypeScript types
│   ├── auth.types.ts
│   ├── employee.types.ts
│   ├── role.types.ts
│
├── utils/                # Helpers
│   ├── formatDate.ts
│   ├── constants.ts
│
├── config/               # App config
│   ├── env.ts
│
├── App.tsx
├── main.tsx