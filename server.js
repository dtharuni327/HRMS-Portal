const cron = require("node-cron");

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "workspace@123",
  database: "hrms"
});

const express=require("express");
const cors=require("cors");
const app=express();

app.use(cors());
app.use(express.json())

app.post("/punch-in",(req,res) =>{
    const { employeeId, employeeName, Role } = req.body;

    const today = new Date().toISOString().split("T")[0];
    
    const insertQuery = `
    INSERT INTO attendance 
    (employee_id, employee_name, role, date, punch_in_time)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(insertQuery, [employeeId, employeeName, Role, today], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.send("Already punched in today");
      }
      console.log(err);
      return res.status(500).send("Error");
    }
    res.send("Punch In stored in DB");
  });
});


app.post("/punch-out",(req,res)=>{
    const { employeeId} = req.body;

    const today = new Date().toISOString().split("T")[0];
    const checkQuery = `
    SELECT * FROM attendance
    WHERE employee_id = ? AND date = ?
  `;

  db.query(checkQuery, [employeeId, today], (err, result) => {
    if (err) return res.status(500).send("Error");

    if (result.length === 0) {
      return res.send("No punch in found!");
    }

    const query1 = `
      UPDATE attendance
      SET punch_out_time = NOW()
      WHERE employee_id = ? AND date = ? AND punch_out_time IS NULL
    `;
    db.query(query1, [employeeId, today], (err1, result1) => {
    if (err1) {
      console.log(err1);
      return res.status(500).send("Error");
    }

    if (result1.affectedRows === 0) {
      return res.send("Already punched out");
    }
    const query2 = `
      UPDATE attendance
      SET total_hours = TIMESTAMPDIFF(MINUTE, punch_in_time, punch_out_time) / 60
      WHERE employee_id = ? AND date = ?
      `;

    db.query(query2, [employeeId, today], (err2) => {
      if (err2) {
        console.log(err2);
        return res.status(500).send("Error");
      }
    res.send("Punch Out updated");
    });
    });
  });
});

/*----
cron.schedule("50 14 * * *", () => {
  console.log("⏰ Auto Punch-Out running at 2:50 PM");

  const today = new Date().toISOString().split("T")[0];
  const fixedTime = "14:50:00";

  const query = `
    UPDATE attendance
    SET 
      punch_out_time = ?,
      total_hours = TIMESTAMPDIFF(MINUTE, punch_in_time, NOW()) / 60
    WHERE date = ?
      AND punch_out_time IS NULL
  `;

  db.query(query, [fixedTime, fixedTime, today], (err, result) => {
    if (err) {
      console.log("❌ Auto punch-out error:", err);
    } else {
      console.log("✅ Auto punch-out done:", result.affectedRows);
    }
  });
});
--------*/
app.listen(5000, () =>{
    console.log("server running on port 5000")
});