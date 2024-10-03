import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { token } from "morgan";
import config from "../../config/config";
import {
  ApplicationError,
  ApplicationRequest,
  ApplicationUserSessionToken,
  IntranetReject,
  UserSession
} from "../../utils/Types";
import { AuthenticationErrors, GeneralErrors } from "./BackendErrors";
import RequestManager from "./RequestManager";
import Utils from "../../utils/Utils";

export default class TokenManager {
  static buildSessionToken(
    expressRequest: Request,
    response: Response,
    next: NextFunction
  ) {
    if (expressRequest.method === "GET") {
      const request = expressRequest as ApplicationRequest<{
        data: {};
        token: string;
      }>;
      if (!expressRequest.query.token) {
        request.hasValidToken = true;
        return next();
        // return RequestManager.sendResponse(response, {
        //   success: false,
        //   error: {
        //     code: AuthenticationErrors.AUTH_TOKEN_IS_NOT_AUTHENTIC,
        //     message: `Any valid token was provided`
        //   }
        // });
      }
      const { token: tokenGet } = request.query;
      if (tokenGet && typeof tokenGet === "string") {
        TokenManager.decodeToken(tokenGet)
          .then((tokenData: ApplicationUserSessionToken) => {
            request.rawToken = tokenGet;
            request.tokenDecryptedData = tokenData;
            request.hasValidToken = true;
            next();
          })
          .catch((error: ApplicationError) => {
            Utils.manageError(error);
            RequestManager.sendResponse(response, {
              success: false,
              error
            });
          });
      } else {
        return RequestManager.sendResponse(response, {
          success: false,
          error: {
            code: AuthenticationErrors.AUTH_TOKEN_IS_NOT_AUTHENTIC,
            message: `Any valid token was provided`
          }
        });
      }
    }
    // requete POST
    else if (expressRequest.method === "POST") {
      const request = expressRequest as ApplicationRequest<{
        data: {};
        token: string;
      }>;

      // eslint-disable-next-line no-shadow
      const { data, token } = request.body;
      const rawToken = request.headers["x-user-token"] as string;
      const backendToken = request.headers["x-access-token"] as string;

      //Verification du token d'accès au backend
      if (
        backendToken &&
        config.server.security.backendTokenSecretKey === backendToken
      ) {
        return RequestManager.sendResponse(response, {
          success: false,
          error: {
            code: GeneralErrors.PACKET_NOT_AUTHENTIC,
            message: `The packet is not authentic`
          }
        });
      } else {
        return RequestManager.sendResponse(response, {
          success: false,
          error: {
            code: AuthenticationErrors.AUTH_TOKEN_IS_NOT_AUTHENTIC,
            message: `Any valid token was provided`
          }
        });
      }
    }
  }

  /*
   * Fonction qui retourne une promise avec le token décodé
   *
   * Parameter: token string
   * Return: Promise<ApplicationUserSessionToken>
   */
  // eslint-disable-next-line no-shadow
  static decodeToken(token: string): Promise<ApplicationUserSessionToken> {
    return new Promise<ApplicationUserSessionToken>(
      (resolve, reject: IntranetReject) => {
        if (token) {
          jwt.verify(
            token,
            config.server.security.jwtTokenSecretKey,
            (error, decodedToken) => {
              if (error) {
                console.log(error.message);
                if (error.name === "TokenExpiredError") {
                  reject({
                    code: AuthenticationErrors.AUTH_TOKEN_EXPIRED,
                    message: "The provided token is expired"
                  });
                } else {
                  reject({
                    code: AuthenticationErrors.AUTH_TOKEN_IS_NOT_AUTHENTIC,
                    message: "The provided token is not authentic"
                  });
                }
              } else {
                resolve(decodedToken as ApplicationUserSessionToken);
              }
            }
          );
        } else {
          reject({
            code: AuthenticationErrors.AUTH_NO_TOKEN_PROVIDED,
            message: "Any token was provided"
          });
        }
      }
    );
  }
}
