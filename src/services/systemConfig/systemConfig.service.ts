import { systemConfigRepository } from "../../repositories/systemConfig/systemConfig.repository";
import { SYSTEM_CONFIG_MESSAGES } from "../../constants/systemConfig.constants";

export const createSystemConfigService = async (data: any, user: any) => {
  const existingConfig = await systemConfigRepository.getActiveSystemConfig();
  if (existingConfig) {
    throw new Error(SYSTEM_CONFIG_MESSAGES.ALREADY_EXISTS);
  }

  const config = await systemConfigRepository.createSystemConfig(data, user);
  return {
    success: true,
    message: SYSTEM_CONFIG_MESSAGES.CREATED,
    data: config
  };
};

export const updateSystemConfigService = async (configKey: string, data: any, user: any) => {
  const existingConfig = await systemConfigRepository.getSystemConfigByKey(configKey);
  if (!existingConfig) {
    throw new Error(SYSTEM_CONFIG_MESSAGES.NOT_FOUND);
  }

  const config = await systemConfigRepository.updateSystemConfig(configKey, data, user);
  return {
    success: true,
    message: SYSTEM_CONFIG_MESSAGES.UPDATED,
    data: config
  };
};

export const deleteSystemConfigService = async (configKey: string, user: any) => {
  const config = await systemConfigRepository.deleteSystemConfig(configKey, user);
  return {
    success: true,
    message: SYSTEM_CONFIG_MESSAGES.DELETED,
    data: config
  };
};

export const getAllSystemConfigService = async () => {
  return await systemConfigRepository.getAllSystemConfig();
};

export const getSystemConfigByKeyService = async (configKey: string) => {
  const config = await systemConfigRepository.getSystemConfigByKey(configKey);
  if (!config) {
    throw new Error(SYSTEM_CONFIG_MESSAGES.NOT_FOUND);
  }

  return config;
};
