import cron from "node-cron";
import { db } from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// ---------------- AUTO PUNCH OUT ----------------

cron.schedule("0 18 * * *", async() => {
  console.log("Auto Punch-Out running at 6:00 PM");
try{
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata"
  });
  const query = `
    UPDATE attendance
    SET 
      punch_out_time = NOW(),
      punch_out_type = 'AUTO',
      total_hours = TIMESTAMPDIFF(MINUTE, punch_in_time, NOW()) / 60
      WHERE date = ?
      AND punch_out_time IS NULL 
      AND punch_in_time IS NOT NULL
  `;
    const [result] = await db.query<ResultSetHeader>(query, [today]);

    console.log("Auto punch-out done: ",result.affectedRows);
}
  catch(error){
    console.log("Auto punch-out error: ",error);
  }
});