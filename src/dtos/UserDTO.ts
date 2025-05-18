import { UserRole } from "../services/permissions/permissionsService";

export interface UserDTO {
  id: string;
  name: string;
  birthDate: string;
  email: string;
  role: UserRole;
  photoUrl: string;
  isActive: boolean;
  isVerified: boolean;
  verificationCode: string
  verificationCodeValidation: string
  forgotPasswordCode: string;
  forgotPasswordCodeValidation: string
  deleteAccountCode: string
  deleteAccountCodeValidation: string
  status: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  biografia: string;
}