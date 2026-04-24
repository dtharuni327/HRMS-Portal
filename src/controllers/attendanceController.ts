import { Request, Response } from "express";
import { db } from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// ------------------ PUNCH IN ------------------

export const punchIn = async(req: Request, res: Response) => {
  try{
  const { employeeId} = req.body;

  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

  const currentTime = now.getHours() * 60 + now.getMinutes();

    // Block after 5.50 PM
    if (currentTime >= 17 * 60 + 50) 
    {
        return res.status(400).json({
            message: "Punch-in not allowed after 5:50 PM",
        });
    }
  const today = new Date().toISOString().split("T")[0]

  //check existing
  const [existing] = await db.query<RowDataPacket[]>(
      `SELECT * FROM attendance WHERE employee_id = ? AND date = ?`,
      [employeeId, today]
    );

    if (existing.length > 0) {
        return res.status(400).json({
          message: "Already punched in today",
        });
      }

    // STATUS LOGIC

    let status = "Present";

    if (currentTime > 12 * 60 + 30) { // 12.30 clock
      status = "Half Day";
    } 
    else if (currentTime > 11 * 60) { // 11 clock
      status = "Late";
    }

    //--------insert------------------------

    await db.query<ResultSetHeader>(
      `INSERT INTO attendance (employee_id, date, punch_in_time, status)
       VALUES (?, ?, NOW(), ?)`,
      [employeeId, today, status]
    );

    return res.status(200).json({
      message: `Punch-in marked as ${status}`,
    });

  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ------------------ PUNCH OUT ------------------

export const punchOut = async(req: Request, res: Response) => {
  try{
  const { employeeId } = req.body;

  const today = new Date().toISOString().split("T")[0]

  //check existing
  const [rows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM attendance WHERE employee_id = ? AND date = ?`,
      [employeeId, today]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: "No punch in found",
      });
    }

    //-------------update-------------
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE attendance
       SET 
         punch_out_time = NOW(),
         punch_out_type = 'MANUAL',
         total_hours = TIMESTAMPDIFF(MINUTE, punch_in_time, NOW()) / 60
         WHERE employee_id = ?
         AND date = ?
         AND punch_out_time IS NULL`,
      [employeeId, today]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Already punched out",
      });
    }

    return res.status(200).json({
      message: "Punch-out successful",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};