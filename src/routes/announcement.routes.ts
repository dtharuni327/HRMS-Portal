import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validation.middleware";
import { addAnnouncementValidation } from "../validations/announcement/addAnnouncement.validation";
import { getAnnouncementByIdValidation } from "../validations/announcement/getAnnouncementById.validation";
import { deleteAnnouncementValidation } from "../validations/announcement/deleteAnnouncement.validation";
import { createAnnouncement, getAnnouncements, getAnnouncementById, deleteAnnouncement } from "../controllers/announcement/announcement.controller";

const router = Router();

router.post(
  "/create",
  authenticate,
  authorize(["HR Admin", "Manager", "Super Admin"]),
  addAnnouncementValidation,
  validate,
  createAnnouncement
);

router.get(
  "/all",
  authenticate,
  getAnnouncements
);

router.get(
  "/:announcementId",
  authenticate,
  getAnnouncementByIdValidation,
  validate,
  getAnnouncementById
);

router.delete(
  "/delete/:announcementId",
  authenticate,
  authorize(["HR Admin", "Manager", "Super Admin"]),
  deleteAnnouncementValidation,
  validate,
  deleteAnnouncement
);

export default router;
