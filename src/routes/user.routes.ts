import express, { Request, Response } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { Role } from "../config/roles";

const router = express.Router();

router.get("/admin", authenticate, authorize(Role.SUPER_ADMIN), (req: Request, res: Response) => {
  res.send("Super Admin Dashboard");
});

router.get("/hr", authenticate, authorize(Role.HR_ADMIN), (req: Request, res: Response) => {
  res.send("HR Dashboard");
});

router.get("/manager", authenticate, authorize(Role.MANAGER), (req: Request, res: Response) => {
  res.send("Manager Dashboard");
});

router.get("/employee", authenticate, authorize(Role.EMPLOYEE), (req: Request, res: Response) => {
  res.send("Employee Dashboard");
});

router.get("/finance", authenticate, authorize(Role.FINANCE), (req: Request, res: Response) => {
  res.send("Finance Dashboard");
});

router.get("/client", authenticate, authorize(Role.CLIENT), (req: Request, res: Response) => {
  res.send("Client Dashboard");
});

export default router;