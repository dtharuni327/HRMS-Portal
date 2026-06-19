import { Router } from "express";

import { createProjectEffortController } from "../controllers/projectEffort/createProjectEffort";
import { getProjectEffortsController } from "../controllers/projectEffort/getProjectEfforts";
import { getProjectEffortByIdController } from "../controllers/projectEffort/getProjectEffortById";
import { getProjectEffortByEmployeeController } from "../controllers/projectEffort/getProjectEffortByEmployee";
import { updateProjectEffortController } from "../controllers/projectEffort/updateProjectEffort";
import { deleteProjectEffortController } from "../controllers/projectEffort/deleteProjectEffort";

const router = Router();

router.post("/", createProjectEffortController);
router.get("/", getProjectEffortsController);
router.get("/:effortId", getProjectEffortByIdController);
router.get("/employee/:empId", getProjectEffortByEmployeeController);
router.put("/:effortId", updateProjectEffortController);
router.delete("/:effortId", deleteProjectEffortController);

export default router;