import { Request, Response } from "express";
import db from "../config/db";

// APPLY LEAVE
export const applyLeave = (req: any, res: Response) => {
  console.log("API HIT");
  console.log("User:", req.user);
  const { leave_type, from_date, to_date, reason } = req.body;

  db.query(
    "INSERT INTO leaves (user_id, leave_type, from_date, to_date, reason) VALUES (?, ?, ?, ?, ?)",
    [req.user.id, leave_type, from_date, to_date, reason],
    (err) => {
      console.log("After DB");
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      return res.json({ message: "Leave applied" }); // ✅ MUST BE HERE
    }
  );
};

// GET LEAVES
export const getAllLeaves = (req: Request, res: Response) => {
  db.query(
    `SELECT leaves.*, users.name, users.emp_id 
     FROM leaves 
     JOIN users ON leaves.user_id = users.id`,
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result);
    }
  );
};

// APPROVE / REJECT
export const updateLeaveStatus = (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // APPROVED / REJECTED

  db.query(
    "UPDATE leaves SET status = ? WHERE id = ?",
    [status, id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Leave status updated" });
    }
  );
};