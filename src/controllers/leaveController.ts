import { Request, Response } from "express";
import db from "../config/db";

// APPLY LEAVE
export const applyLeave = (req: any, res: Response) => {
  const { leave_type, from_date, to_date, reason } = req.body;

  db.query(
    "INSERT INTO leaves (user_id, leave_type, from_date, to_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)",
    [req.user.id, leave_type, from_date, to_date, reason, "PENDING"],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Leave applied" });
    }
  );
};

// GET ALL LEAVES
export const getAllLeaves = (req: Request, res: Response) => {
  db.query("SELECT * FROM leaves", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// UPDATE STATUS
export const updateLeaveStatus = (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE leaves SET status = ? WHERE id = ?",
    [status, id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Leave status updated" });
    }
  );
};