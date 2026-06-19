import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  getTeamDirectorySchema,
  getTeamMemberSchema,
} from "../validations/teamdirectory/getTeamDirectory.validation";
import { getTeamDirectory } from "../controllers/teamdirectory/getTeamDirectory.controller";
import { getTeamMemberDetail } from "../controllers/teamdirectory/getTeamMemberDetail.controller";

const router = Router();


router.get(
  "/",
  authenticate,
  validate(getTeamDirectorySchema, "query"),
  getTeamDirectory
);


router.get(
  "/:empId",
  authenticate,
  validate(getTeamMemberSchema, "params"),
  getTeamMemberDetail
);

export default router;
