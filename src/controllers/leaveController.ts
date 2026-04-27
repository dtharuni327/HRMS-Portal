import { Request, Response } from "express";
import db from "../config/db";

// APPLY LEAVE
export const applyLeave = (req: any, res: Response) => {
  const { leave_type, from_date, to_date, reason } = req.body;

  db.query(
    "INSERT INTO leaves (user_id,leave_type,from_date,to_date,reason) VALUES (?,?,?,?,?)",
    [req.user.id, leave_type, from_date, to_date, reason],
    () => res.json({ message: "Leave applied" })
  );
};

// GET LEAVES
export const getLeaves = (req: Request, res: Response) => {
  db.query("SELECT * FROM leaves", (err, result) => {
    res.json(result);
  });
};

// APPROVE / REJECT
export const updateLeave = (req: Request, res: Response) => {
  const { status } = req.body;

  db.query(
    "UPDATE leaves SET status=? WHERE id=?",
    [status, req.params.id],
    () => res.json({ message: "Updated" })
  );
};