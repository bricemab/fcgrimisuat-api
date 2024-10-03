import MysqlAbstractEntity from "../Global/MysqlAbstractEntity";
import { DataBaseTeam } from "../Global/DatabaseTypes";
import { GeneralErrors } from "../Global/BackendErrors";
import Utils from "../../utils/Utils";

export default class TeamEntity extends MysqlAbstractEntity<boolean> {
  public id: string;
  public name: string;
  public isActive: boolean;
  public link: string;

  constructor(id: string, name: string, isActive: boolean, link: string) {
    super();
    this.id = id;
    this.name = name;
    this.isActive = isActive;
    this.link = link;
  }

  async save() {
    try {
      let responseData;
      if (!this.existsInDataBase) {
        responseData = await Utils.executeMysqlRequest(
          Utils.getMysqlPool().execute(
            "INSERT INTO `teams` (`id`, `name`, `is_active`, `link`) VALUES (:id, :name, :isActive, :link)",
            {
              id: this.id,
              name: this.name,
              isActive: this.isActive ? "1" : "0",
              link: this.link
            }
          )
        );
      } else {
        responseData = await Utils.executeMysqlRequest(
          Utils.getMysqlPool().execute(
            "UPDATE `teams` SET `name`= :name, `is_active`=:isActive, `link`=:link WHERE `id`= :id",
            {
              id: this.id,
              name: this.name,
              isActive: this.isActive ? "1" : "0",
              link: this.link
            }
          )
        );
      }
      if (responseData.affectedRows === 0) {
        return {
          success: false,
          error: {
            code: GeneralErrors.DATABASE_REQUEST_ERROR,
            message: "The team has not been persisted in the database"
          }
        };
      }
      return {
        success: true,
        data: {
          team: this
        }
      };
    } catch (e) {
      // @ts-ignore
      Utils.manageError(e);
      return {
        success: false,
        error: {
          code: GeneralErrors.DATABASE_REQUEST_ERROR,
          message: "An error has occurred while saving data"
        }
      };
    }
  }

  static fromDatabaseObject(databaseObject: DataBaseTeam) {
    const team = new TeamEntity(
      databaseObject.id,
      databaseObject.name,
      databaseObject.isActive,
      databaseObject.link
    );
    team.existsInDataBase = true;

    return team;
  }

  toJSON(): Object {
    return {
      id: this.id,
      name: this.name,
      isActive: this.isActive,
      link: this.link
    };
  }
}
