import cron from "node-cron";
import { db } from "./db";

// ---------------- AUTO PUNCH OUT ----------------

cron.schedule("0 18 * * *", () => {
  console.log("Auto Punch-Out running at 6:00 PM");

  const today = new Date().toLocaleDateString("en-CA");
  const query = `
    UPDATE attendance
    SET 
      punch_out_time = '18:00:00',
      punch_out_type = 'AUTO',
      total_hours = TIMESTAMPDIFF(MINUTE,CONCAT(date, ' ', punch_in_time),CONCAT(date, ' 18:00:00')) / 60
    WHERE date = ?
      AND punch_out_time IS NULL 
      AND punch_in_time IS NOT NULL
      AND punch_in_time <= '18:00:00'
  `;

  db.query(query, [today], (err, result: any) => {
    if (err) {
      console.log("Auto punch-out error:", err);
    } else {
      console.log("Auto punch-out done:", result.affectedRows);
    }
  });
});