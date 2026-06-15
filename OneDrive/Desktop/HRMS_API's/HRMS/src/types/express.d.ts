import { JwtPayload } from "jsonwebtoken";
export interface CustomUser extends JwtPayload {Emp_id: string;
  role: string;}
declare global {namespace Express {
    interface Request {user?: CustomUser;
    }
  }
}
export {};