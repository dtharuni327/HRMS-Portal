import { announcementRepository } from "../../repositories/announcement/announcement.repository";
import { ANNOUNCEMENT_MESSAGES } from "../../constants/announcement.constants";

export const createAnnouncementService = async (data: any, user: any) => {
  const duplicate = await announcementRepository.checkDuplicate(data.title, data.content);
  if (duplicate) {
    throw new Error(ANNOUNCEMENT_MESSAGES.DUPLICATE);
  }

  const announcement = await announcementRepository.createAnnouncement(data, user);
  return {
    success: true,
    message: ANNOUNCEMENT_MESSAGES.CREATED,
    data: announcement
  };
};

export const getAnnouncementsService = async () => {
  return await announcementRepository.getAnnouncements();
};

export const getAnnouncementByIdService = async (announcementId: string) => {
  const announcement = await announcementRepository.getAnnouncementById(announcementId);
  if (!announcement) {
    throw new Error(ANNOUNCEMENT_MESSAGES.NOT_FOUND);
  }

  return announcement;
};

export const deleteAnnouncementService = async (announcementId: string, user: any) => {
  const announcement = await announcementRepository.getAnnouncementById(announcementId);
  if (!announcement) {
    throw new Error(ANNOUNCEMENT_MESSAGES.NOT_FOUND);
  }

  const result = await announcementRepository.deleteAnnouncement(announcementId, user);
  return {
    success: true,
    message: ANNOUNCEMENT_MESSAGES.DELETED,
    data: result
  };
};
