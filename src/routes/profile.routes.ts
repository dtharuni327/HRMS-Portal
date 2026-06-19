import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { updateProfileSchema } from "../validations/profile/update.profile.validation";
import { changePasswordSchema } from "../validations/profile/changePassword.validation";
import { getMyProfile } from "../controllers/profile/getMyProfile.controller";
import { updateMyProfile } from "../controllers/profile/updateMyProfile.controller";
import { changePassword } from "../controllers/profile/changePassword.controller";

const router = Router();

// accessible by any logged-in role.


router.get("/me", authenticate, getMyProfile);

router.put("/me", authenticate, validate(updateProfileSchema, "body"), updateMyProfile);

router.put("/me/password", authenticate, validate(changePasswordSchema, "body"), changePassword);

export default router;
