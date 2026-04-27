import express from "express";
import {
  getHolidays,
  addHoliday,
  deleteHoliday,
} from "../controllers/holidayController";

const router = express.Router();

router.get("/holidays", getHolidays);
router.post("/holiday", addHoliday);
router.delete("/holiday/:id", deleteHoliday);

export default router;