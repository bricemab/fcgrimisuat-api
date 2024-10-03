import UserEntity from "./UserEntity";
import { ApplicationResponsePromise } from "../../utils/Types";
import Utils from "../../utils/Utils";
import { DataBaseUser } from "../Global/DatabaseTypes";
import { GeneralErrors } from "../Global/BackendErrors";
import config from "../../config/config";

/*
 * Class de Management Users
 * Ici sont géré les fonctions utils en lien avec le nom de la classe
 */
export default class UsersManager {
  /*
   * Récupérer le User par email
   *
   * Parameter: email string
   * Return: ApplicationResponsePromise<{ user: UserEntity }>
   */
  static async findOneByEmail(
    email: string
  ): ApplicationResponsePromise<{ user: UserEntity }> {
    const userFromDatabase = Utils.castMysqlRecordToObject<DataBaseUser>(
      await Utils.getMysqlPool().execute(
        "SELECT * FROM users WHERE email = ? AND archived = 0",
        [email]
      )
    );

    if (!userFromDatabase) {
      return {
        success: false,
        error: {
          code: GeneralErrors.OBJECT_NOT_FOUND_IN_DATABASE,
          message: "The account couldn't be found in database",
          details: {
            email
          }
        }
      };
    }

    return {
      success: true,
      data: {
        user: await UserEntity.fromDatabaseObject(userFromDatabase)
      }
    };
  }

  /*
   * Récupérer le User par ID
   *
   * Parameter: id string
   * Parameter: isBypassArchived boolean
   * Return: ApplicationResponsePromise<{ user: UserEntity }>
   */
  static async findOneById(
    id: number,
    isBypassArchived?: boolean
  ): ApplicationResponsePromise<{ user: UserEntity }> {
    let sql = "SELECT * FROM users WHERE id = ?";

    if (!isBypassArchived) {
      sql += " AND archived = 0";
    }

    const userFromDatabase = Utils.castMysqlRecordToObject<DataBaseUser>(
      await Utils.getMysqlPool().execute(sql, [id])
    );

    if (!userFromDatabase) {
      return {
        success: false,
        error: {
          code: GeneralErrors.OBJECT_NOT_FOUND_IN_DATABASE,
          message: "The account couldn't be found in database",
          details: {
            id
          }
        }
      };
    }

    return {
      success: true,
      data: {
        user: await UserEntity.fromDatabaseObject(userFromDatabase)
      }
    };
  }
}
