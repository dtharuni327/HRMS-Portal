import { Request, Response } from "express";
import { createAnnouncementService, getAnnouncementsService, getAnnouncementByIdService, deleteAnnouncementService } from "../../services/announcement/announcement.service";
import { ANNOUNCEMENT_MESSAGES } from "../../constants/announcement.constants";

export const createAnnouncement = async (req: any, res: Response) => {
  try {
    const result = await createAnnouncementService(req.body, req.user);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAnnouncements = async (_req: Request, res: Response) => {
  try {
    const announcements = await getAnnouncementsService();
    return res.status(200).json({
      message: ANNOUNCEMENT_MESSAGES.FETCHED,
      data: announcements
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAnnouncementById = async (req: Request, res: Response) => {
  try {
    const { announcementId } = req.params;
    const announcement = await getAnnouncementByIdService(announcementId);
    return res.status(200).json({
      message: ANNOUNCEMENT_MESSAGES.FETCHED_ONE,
      data: announcement
    });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const deleteAnnouncement = async (req: any, res: Response) => {
  try {
    const { announcementId } = req.params;
    const result = await deleteAnnouncementService(announcementId, req.user);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
