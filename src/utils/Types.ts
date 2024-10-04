import { Request } from "express";
import {
  AuthenticationErrors,
  GeneralErrors,
  UserErrors
} from "../modules/Global/BackendErrors";
import UserEntity from "../modules/Users/UserEntity";

export interface ApplicationError {
  code: GeneralErrors | AuthenticationErrors | UserErrors;
  message: string;
  details?: any;
}

export type IntranetReject = (error: ApplicationError) => void;

export interface UserSession {
  id: number;
  email: string;
  lastname: string;
  firstname: string;
  password: string;
  companyId: number;
  archived: boolean;
}

export interface ApplicationUserSessionToken {
  currentUser: UserSession;
  iat: number;
  exp: number;
}

export interface ApplicationRequest<BodyData> extends Request {
  request: UserSession;
  rawToken: string;
  hasValidToken: boolean;
  tokenDecryptedData?: ApplicationUserSessionToken;
  body: BodyData;
  headers: {
    "x-access-token": string;
    "x-user-token"?: string;
  };
}

export interface ApplicationResponse<DataType> {
  success: boolean;
  data?: DataType;
  error?: ApplicationError;
}
export type ApplicationResponsePromise<DataType> = Promise<
  ApplicationResponse<DataType>
>;

export enum MATCH_STATUS_TYPE {
  PLAYED = "",
  RETURNED = "R",
  NO_RESULT = "AN"
}
