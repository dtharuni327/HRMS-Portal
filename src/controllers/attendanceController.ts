import { Request, Response } from "express";
import { db } from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// ------------------ PUNCH IN ------------------

export const punchIn = async(req: Request, res: Response) => {
  try{
  const { Emp_Id, workMode } = req.body;

  // Validate required fields

  if(!Emp_Id || ! workMode){
    return res.status(400).json({
      success: false,
      message: "Emp_Id and workMode are required"
    })
  }

  // Validate workMode
    const validModes = ["WFH", "WFO", "HYBRID"];
    const mode = workMode.toUpperCase();

    if (!validModes.includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "workMode must be WFH, WFO or Hybrid",
      });
    }

  const now = new Date(
  new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
);
  const currentTime = now.getHours() * 60 + now.getMinutes();

    // Block after 5.50 PM
    if (currentTime >= 17 * 60 + 50) 
    {
        return res.status(400).json({
          success: false,
            message: "Punch-in not allowed after 5:50 PM",
        });
    }
  const today = new Date(
  new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
)
  .toISOString()
  .split("T")[0];

  //check existing
  const [existing] = await db.query<RowDataPacket[]>(
      `SELECT 1 FROM attendance WHERE Emp_id = ? AND date = ?`,
      [Emp_Id, today]
    );

    if (existing.length > 0) {
        return res.status(400).json({
          success: false,
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
      `INSERT INTO attendance (Emp_id, date, punch_in_time, status, work_mode)
       VALUES (?, ?, NOW(), ?, ?)`,
      [Emp_Id, today, status, mode]
    );

    return res.status(200).json({
      success: true,
      message: `Punch-in marked as ${status}`,
      data: {
        Emp_Id,
        workMode: mode
      }
    });

  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ------------------ PUNCH OUT ------------------

export const punchOut = async(req: Request, res: Response) => {
  try{
  const { Emp_Id } = req.body;
  
  if (!Emp_Id) {
    return res.status(400).json({
    success: false,
    message: "Emp_Id is required"
    });
  }
  const now = new Date(
  new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const today = now.toISOString().split("T")[0]

  //check existing
  const [rows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM attendance WHERE Emp_id = ? AND date = ?`,
      [Emp_Id, today]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No punch in found",
      });
    }

    //update
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE attendance
       SET 
         punch_out_time = NOW(),
         punch_out_type = 'MANUAL',
         total_hours = ROUND(TIMESTAMPDIFF(MINUTE, punch_in_time, NOW()) / 60, 2)
       WHERE Emp_id = ?
       AND date = ?
       AND punch_out_time IS NULL`,
      [Emp_Id, today]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "Already punched out",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Punch-out successful",
    });

  } 
  
  catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//-----------------GET ATTENDANCE---------------------

export const getAttendance = async (req: Request, res: Response) => {
  try {
    const empId  = req.params.empId as string;

    const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM attendance
     WHERE Emp_id = ?
     ORDER BY date DESC`,
     [empId]
    );
    if (rows.length === 0) {
        return res.status(404).json({
          success: true,
          message: "No attendance records found",
          data: []
        });
    }

    return res.status(200).json({
      success: true,
      data: rows
    });

  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

//---------------Attendance summary--------------------

export const getAttendanceSummary = async(req:Request, res:Response)=>{
  try{
    const  empId  = req.params.empId as string;
    const monthNum = Number(req.query.month);
    const yearNum = Number(req.query.year);

    //validate query

    if(isNaN(monthNum) || isNaN(yearNum )){
      return res.status(400).json({
        success: false,
        message: "Month and year are required"
      });
    }

    //check employee exists
    const [check] = await db.query<RowDataPacket[]>(
      `SELECT 1 FROM attendance WHERE Emp_id = ? LIMIT 1`,
      [empId]
    );

    if(check.length===0){
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    // count by status

    const [statusRows] = await db.query<RowDataPacket[]>(
      `SELECT status, COUNT(*) as count
      FROM attendance
      WHERE Emp_id=?
      AND MONTH(date) = ?
      AND YEAR(date)=?
      GROUP BY status`,
      [empId, monthNum, yearNum]
    );

//  Count WFH separately
    const [wfhRows] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) as count
       FROM attendance
       WHERE Emp_id = ?
       AND work_mode = 'WFH'
       AND MONTH(date) = ?
       AND YEAR(date) = ?`,
      [empId, monthNum, yearNum]
    );

    //  Default summary
    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      half_day: 0,
      wfh: 0
    };

    

    // Fill status counts
    statusRows.forEach((row: any) => {
      const key = row.status.toLowerCase().replace(/\s+/g, "_");
      
      if(key === "present") summary.present =row.count;
      else if(key === "late") summary.late = row.count;
      else if(key === "half day") summary.half_day=row.count;
    });
    
    // Get total days in month
    const totalDays = new Date(yearNum, monthNum, 0).getDate();

    // Get attended days
    const [totalRows] = await db.query<RowDataPacket[]>(
    `SELECT COUNT(*) as count
    FROM attendance
    WHERE Emp_id = ?
    AND MONTH(date) = ?
    AND YEAR(date) = ?`,
    [empId, monthNum, yearNum]
    );

    const attendedDays = totalRows[0].count;
    summary.absent = Math.max(0,totalDays - attendedDays);

    // Fill WFH
    summary.wfh = wfhRows[0]?.count || 0;

    return res.status(200).json({
      success: true,
      data: summary
    });

  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};