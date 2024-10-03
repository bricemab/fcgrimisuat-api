import moment from "moment";
import jwt from "jsonwebtoken";
import { Response, Router } from "express";
import UsersManager from "../modules/Users/UsersManager";
import { ApplicationRequest } from "../utils/Types";
import RequestManager from "../modules/Global/RequestManager";
import {
  AuthenticationErrors,
  GeneralErrors,
  UserErrors
} from "../modules/Global/BackendErrors";
import AclManager from "../permissions/AclManager";
import { Permission } from "../permissions/permissions";
import config from "../config/config";
import { UserRole } from "../modules/Users/UserRoles";

const UserRouter = Router();

/* ============================================================================.
 * ACTIONS DE BASE.
 * =============================================================================.
 */

/*
 * Requete POST qui verifie le password et username
 *
 * Parameter: token string
 * Parameter: username string
 * Parameter: password string
 * Return: {
          token,
          user,
          role: UserRole.USER_LOGGED
        }
 */
UserRouter.post(
  "/authenticate",
  AclManager.routerHasPermission(Permission.specialState.userLoggedOff),
  RequestManager.asyncResolver(
    async (
      request: ApplicationRequest<{
        token: string;
        data: {
          email: string;
          password: string;
        };
      }>,
      response: Response
    ) => {
      if (request.hasValidToken) {
        return RequestManager.sendResponse(response, {
          success: false,
          error: {
            code: AuthenticationErrors.AUTH_MUST_BE_LOGGED_OFF,
            message: "You must be logged off"
          }
        });
      }

      if (
        !request.body.data ||
        !request.body.data.email.trim() ||
        !request.body.data.password.trim()
      ) {
        return RequestManager.sendResponse(response, {
          success: false,
          error: {
            code: GeneralErrors.INVALID_REQUEST,
            message: "This request is malformated or invalid"
          }
        });
      }

      const { email, password } = request.body.data;

      const userResponse = await UsersManager.findOneByEmail(email);
      if (!userResponse.success || !userResponse.data) {
        return RequestManager.sendResponse(response, {
          success: false,
          error: {
            code: UserErrors.ERROR_WHILE_SEARCHING_USER_IN_DATABASE,
            message: "An error has occurred while retriving user by email"
          }
        });
      }
      const { user } = userResponse.data;

      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        return RequestManager.sendResponse(response, {
          success: false,
          error: {
            code: AuthenticationErrors.AUTH_INVALID_CREDENTIALS,
            message: "Invalid credentials"
          }
        });
      }

      const token = jwt.sign(
        {
          currentUser: user
        },
        config.server.security.jwtTokenSecretKey,
        {
          expiresIn: `${config.sessionDurationInMinutes}m`
        }
      );

      RequestManager.sendResponse(response, {
        success: true,
        data: {
          token,
          user,
          role: UserRole.USER_LOGGED
        }
      });
    }
  )
);

export default UserRouter;
