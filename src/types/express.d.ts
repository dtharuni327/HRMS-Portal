import { JwtPayload } from "jsonwebtoken";
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> origin/feature/attendance-wfh

export interface CustomUser extends JwtPayload {
  Emp_id: string;
  role: string;
<<<<<<< HEAD
=======
  Dashboard_id?: number;
>>>>>>> origin/feature/attendance-wfh
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomUser;
    }
  }
}

<<<<<<< HEAD
export {};
=======
export interface CustomUser extends JwtPayload {Emp_id: string;
  role: string;}
declare global {namespace Express {
    interface Request {user?: CustomUser;
    }
  }
}
export {};
>>>>>>> origin/feature/department-roles
=======
export {};
>>>>>>> origin/feature/attendance-wfh
