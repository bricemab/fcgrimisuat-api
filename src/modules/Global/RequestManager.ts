import { Response } from "express";
import { ApplicationError, ApplicationResponse } from "../../utils/Types";
import Utils from "../../utils/Utils";

/*
 * Classe regroupant des outils en lien avec les requêtes.
 */
export default class RequestManager {
  /*
   * Middleware permetant l'utilisation de methodes asynchrones dans les routes. Si pas utilisé risque de bloquer des requetes.
   *
   * Parameter: fn - Fonction à éxécuter dans la route.
   */
  static asyncResolver(fn: any) {
    return (request: any, response: any, next: any) => {
      Promise.resolve(fn(request, response, next)).catch(
        (error: ApplicationError) => {
          Utils.manageError(error);
          RequestManager.sendResponse(response, {
            success: false,
            error
          });
        }
      );
    };
  }

  /*
   * Permet de formatter de manière standard les réponses JSON à envoyer aux clients .
   *
   * Parameter: response - Objet response express.
   * Parameter: dataToSend - Données à envoyer au client.
   * Parameter: status - Code status à mettre dans le header HTTP.
   */
  static sendResponse(
    response: Response,
    dataToSend: ApplicationResponse<any>,
    status?: number
  ) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "*");
    response.setHeader("Access-Control-Allow-Headers", "*");
    if (dataToSend && dataToSend.success) {
      response.status(200).json(dataToSend);
    } else {
      response.status(status || 460).json({
        success: false,
        error: dataToSend.error
      });
    }
  }
}
