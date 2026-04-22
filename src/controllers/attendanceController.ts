import { Request, Response } from "express";
import { db } from "../config/db";


// ------------------ PUNCH IN ------------------

export const punchIn = (req: Request, res: Response) => {
  const { employeeId, employeeName, Role } = req.body;
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const currentTime = now.getHours() * 60 + now.getMinutes();
    // Block after 5.50 PM
  if (currentTime >= 17 * 60 + 50) 
    {
        return res.send("Punch-in not allowed after 5:50 PM");
    }
  const today = new Date().toLocaleDateString("en-CA");
  const checkQuery = `
    SELECT * FROM attendance 
    WHERE employee_id = ? AND date = ?
  `;

  db.query(checkQuery, [employeeId, today], (err, result: any) => {
    if (err) {
      console.log(err);
      return res.send("DB Error");
    }

    if (result.length > 0) {
      return res.send("Already punched in today");
    }

    // STATUS LOGIC

    let status = "Present";

    if (currentTime > 15 * 60 ){    //3 clock
        status = "Absent"
    }
    else if (currentTime > 12 * 60 + 30) { // 12.30 clock
      status = "Half Day";
    } 
    else if (currentTime > 11 * 60) { // 11 clock
      status = "Late";
    }

    const insertQuery = `
      INSERT INTO attendance 
      (employee_id, employee_name, role, date, punch_in_time, status) 
      VALUES (?, ?, ?, ?, NOW(), ?)
    `;

    db.query(
      insertQuery,
      [employeeId, employeeName, Role, today, status],
      (err2) => {
        if (err2) {
          console.log(err2);
          return res.send("Insert Error");
        }

        res.send(`Punch-in marked as ${status}`);
      }
    );
  });
};

// ------------------ PUNCH OUT ------------------

export const punchOut = (req: Request, res: Response) => {
  const { employeeId } = req.body;

  const today = new Date().toLocaleDateString("en-CA");
  const checkQuery = `
    SELECT * FROM attendance
    WHERE employee_id = ? AND date = ?
  `;

  db.query(checkQuery, [employeeId, today], (err, result: any) => {
    if (err) return res.status(500).send("Error");

    if (result.length === 0) {
      return res.send("No punch in found!");
    }
    const query = `
    UPDATE attendance
    SET 
      punch_out_time = NOW(),
      punch_out_type = 'MANUAL',
      total_hours = TIMESTAMPDIFF(
        MINUTE,
        CONCAT(date, ' ', punch_in_time),
        NOW()
      ) / 60
    WHERE employee_id = ? 
      AND date = ?
      AND punch_out_time IS NULL
  `;

  db.query(query, [employeeId, today], (err, result: any) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error");
    }

    if (result.affectedRows === 0) {
      return res.send("Already punched out or no punch-in found");
    }

    res.send("Punch Out updated ");
    });
  });
};