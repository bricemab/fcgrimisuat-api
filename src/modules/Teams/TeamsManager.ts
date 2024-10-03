import TeamEntity from "./TeamEntity";
import { ApplicationResponsePromise } from "../../utils/Types";
import Utils from "../../utils/Utils";
import { GeneralErrors } from "../Global/BackendErrors";
import { DataBaseTeam } from "../Global/DatabaseTypes";

export default class TeamsManager {
  public async findById(
    id: string
  ): ApplicationResponsePromise<{ team: TeamEntity }> {
    const teamFromDatabase = Utils.castMysqlRecordToObject<DataBaseTeam>(
      await Utils.getMysqlPool().execute(
        "SELECT * FROM `teams` WHERE id=:id",
        id
      )
    );

    if (!teamFromDatabase) {
      return {
        success: false,
        error: {
          code: GeneralErrors.OBJECT_NOT_FOUND_IN_DATABASE,
          message: "The team couldn't be found in database",
          details: {
            id
          }
        }
      };
    }

    return {
      success: true,
      data: {
        team: await TeamEntity.fromDatabaseObject(teamFromDatabase)
      }
    };
  }
}
