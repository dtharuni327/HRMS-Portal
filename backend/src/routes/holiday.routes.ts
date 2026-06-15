import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { addHoliday } from "../controllers/holiday/addHoliday.controller";
import { getHoliday } from "../controllers/holiday/getHoliday.controller";
import { deleteHoliday } from "../controllers/holiday/deleteHoliday.controller";
import { getHolidayHistory } from "../controllers/holiday/getHolidayHistory.controller";
import { getRemainingHoliday } from "../controllers/holiday/getRemainingHoliday.controller";
import { getUsedHoliday } from "../controllers/holiday/getUsedHoliday.controller";
import { getTotalHoliday } from "../controllers/holiday/getTotalHoliday.controller";
import { addHolidayValidation } from "../validations/holiday/addHoliday.validation";
import { deleteHolidayValidation } from "../validations/holiday/deleteHoliday.validation";
const router = Router();
router.post("/add",authenticate,addHolidayValidation,
  validate,addHoliday);
router.get("/all",authenticate,getHoliday);
router.get("/history",authenticate,getHolidayHistory);
router.get("/remaining",authenticate,getRemainingHoliday);
router.get("/used",authenticate,getUsedHoliday);
router.get("/total",authenticate,getTotalHoliday);
router.delete("/delete/:client_id",authenticate,
  deleteHolidayValidation,validate,deleteHoliday);
export default router;