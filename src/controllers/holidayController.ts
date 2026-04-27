import { Request, Response } from "express";
import db from "../config/db";

export const getHolidays = (req: Request, res: Response) => {
  db.query("SELECT * FROM holidays", (err, result) => {
    res.json(result);
  });
};

export const addHoliday = (req: Request, res: Response) => {
  const { name, date } = req.body;

  db.query(
    "INSERT INTO holidays (name,date) VALUES (?,?)",
    [name, date],
    () => res.json({ message: "Holiday added" })
  );
};

export const deleteHoliday = (req: Request, res: Response) => {
  db.query(
    "DELETE FROM holidays WHERE id=?",
    [req.params.id],
    () => res.json({ message: "Deleted" })
  );
};