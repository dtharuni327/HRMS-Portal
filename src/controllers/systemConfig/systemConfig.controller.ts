import { Request, Response } from "express";
import {
  createSystemConfigService,
  updateSystemConfigService,
  deleteSystemConfigService,
  getAllSystemConfigService,
  getSystemConfigByKeyService
} from "../../services/systemConfig/systemConfig.service";
import { SYSTEM_CONFIG_MESSAGES } from "../../constants/systemConfig.constants";

export const createSystemConfig = async (req: Request, res: Response) => {
  try {
    const result = await createSystemConfigService(req.body, req.user);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateSystemConfig = async (req: Request, res: Response) => {
  try {
    const { configKey } = req.params;
    const result = await updateSystemConfigService(configKey, req.body, req.user);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteSystemConfig = async (req: Request, res: Response) => {
  try {
    const { configKey } = req.params;
    const result = await deleteSystemConfigService(configKey, req.user);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllSystemConfig = async (_req: Request, res: Response) => {
  try {
    const configs = await getAllSystemConfigService();
    return res.status(200).json({
      message: SYSTEM_CONFIG_MESSAGES.FETCHED,
      data: configs
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSystemConfigByKey = async (req: Request, res: Response) => {
  try {
    const { configKey } = req.params;
    const config = await getSystemConfigByKeyService(configKey);
    return res.status(200).json({
      message: SYSTEM_CONFIG_MESSAGES.FETCHED_ONE,
      data: config
    });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};
