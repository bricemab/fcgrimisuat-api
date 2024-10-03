import bcrypt from "bcrypt";
import moment, { Moment } from "moment";

import Utils from "../../utils/Utils";
import MysqlAbstractEntity from "../Global/MysqlAbstractEntity";
import { DataBaseUser } from "../Global/DatabaseTypes";

/*
 * Entité CampaignLog
 * Aucune fonction d'enregistrement en base de donnée a besoin d'etre fait
 */
export default class UserEntity extends MysqlAbstractEntity<boolean> {
  public id?: number;
  public email: string;
  public firstname: string;
  public lastname: string;
  public password: string;
  public companyId: number;
  public archived: boolean;

  constructor(
    id: number | null,
    email: string,
    firstname: string,
    lastname: string,
    password: string,
    companyId: number,
    archived: boolean
  ) {
    super();
    if (id) {
      this.id = id as number;
    }
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.password = password;
    this.companyId = companyId;
    this.archived = archived;
  }

  async validatePassword(password: string) {
    if (password && this.password) {
      return bcrypt.compare(password, this.password as string);
    }

    return false;
  }

  static fromDatabaseObject(databaseObject: DataBaseUser) {
    const user = new UserEntity(
      databaseObject.id,
      databaseObject.email,
      databaseObject.firstname,
      databaseObject.lastname,
      databaseObject.password,
      databaseObject.company_id,
      databaseObject.archived === 1
    );
    user.existsInDataBase = true;

    return user;
  }

  toJSON(): Object {
    return {
      id: this.id,
      email: this.email,
      lastname: this.lastname,
      firstname: this.firstname,
      companyId: this.companyId,
      archived: this.archived
    };
  }
}
