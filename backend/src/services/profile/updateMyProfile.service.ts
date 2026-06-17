import { updateMyProfileRepo } from "../../repositories/profile/profile.repository";
import { UpdateProfileInput } from "../../validations/profile/update.profile.validation";

interface UpdateOptions extends UpdateProfileInput {
  empId: string;
}

export const updateMyProfileService = async (options: UpdateOptions) => {
  const result = await updateMyProfileRepo(options);
    return result.recordset[0];
};