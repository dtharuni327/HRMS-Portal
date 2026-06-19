import { JwtPayload } from "jsonwebtoken";
<<<<<<< HEAD

export interface CustomUser extends JwtPayload {
  Emp_id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomUser;
    }
  }
}

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
