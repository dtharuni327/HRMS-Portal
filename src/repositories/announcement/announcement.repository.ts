import sql from "mssql";
import { db } from "../../config/db";

export const announcementRepository = {
  async createAnnouncement(data: any, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("Title", sql.VarChar, data.title)
      .input("Content", sql.VarChar, data.content)
      .input("CreatedBy", sql.VarChar, user.Emp_id)
      .input("Status", sql.VarChar, data.status || "PUBLISHED")
      .execute("USP_Announcement_Create");

    return result.recordset?.[0] ?? result;
  },

  async checkDuplicate(title: string, content: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("Title", sql.VarChar, title)
      .input("Content", sql.VarChar, content)
      .execute("USP_Announcement_CheckDuplicate");

    return result.recordset?.[0] ?? null;
  },

  async getAnnouncements() {
    const pool = await db;
    const result = await pool
      .request()
      .execute("USP_Announcement_GetAll");

    return result.recordset ?? [];
  },

  async getAnnouncementById(announcementId: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("AnnouncementId", sql.VarChar, announcementId)
      .execute("USP_Announcement_GetById");

    return result.recordset?.[0] ?? null;
  },

  async deleteAnnouncement(announcementId: string, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("AnnouncementId", sql.VarChar, announcementId)
      .input("DeletedBy", sql.VarChar, user.Emp_id)
      .execute("USP_Announcement_Delete");

    return result.recordset?.[0] ?? result;
  }
};
