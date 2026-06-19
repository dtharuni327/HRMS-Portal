import cron from "node-cron";
import { db } from "../config/db";

cron.schedule("00 19 * * *", async () => {
  console.log("Auto Punch-Out running at 7:00 PM IST");

  try 
  {
    const pool = await db;

    const result = await pool.request().execute("USP_AutoPunchOut");

    console.log(`Auto punch-out completed: ${result.recordset[0].updated_count} employees updated`);
  } catch (error) {
    console.error("Auto punch-out error:", error);
  }
}, { timezone: "Asia/Kolkata" });