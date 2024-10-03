// @ts-ignore
import hash from "string-hash-64";
import base64 from "base-64";
import utf8 from "utf8";
import { Pool, ResultSetHeader } from "mysql2";
import moment from "moment";
import qs from "qs";
import * as util from "util";
import crypto from "crypto";
import GlobalStore from "./GlobalStore";
import Logger from "./Logger";
import { ApplicationError } from "./Types";
import config from "../config/config";
import axios from "axios";

const encoderBase64 = {
  encode(text: string) {
    const bytes = utf8.encode(text);
    return base64.encode(bytes);
  },
  decode(encoded: string) {
    const bytes = base64.decode(encoded);
    return utf8.decode(bytes);
  }
};

const buildHmacSha256Signature = (parameters: Object) => {
  const dataQueryString = qs.stringify(parameters); // .replace("%20", "+");
  // @ts-ignore
  return crypto
    .createHmac("sha256", config.server.security.hmacSecretPacketKey)
    .update(dataQueryString)
    .digest("hex");
};

const validateHmacSha256Signature = (token: string, data: Object) => {
  const signature = buildHmacSha256Signature(data);
  return signature === token;
};

export default {
  buildHmacSha256Signature,
  validateHmacSha256Signature,
  encoderBase64,
  removeAccents(string: string): string {
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  },
  isValidEmail(email: string): boolean {
    const emailRegEx = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return emailRegEx.test(email);
  },
  generateRandomToken(length: number) {
    // edit the token allowed characters
    const a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(
      ""
    );
    const b = [];
    for (let i = 0; i < length; i++) {
      const j: number = ((Math.random() * (a.length - 1)).toFixed(
        0
      ) as unknown) as number;
      b[i] = a[j];
    }
    return b.join("");
  },

  async executeMysqlRequest(fn: any) {
    const [results, other]: [ResultSetHeader, any] = await fn;
    return results;
  },
  generateCurrentDateFileName() {
    const today = new Date();
    return `${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`;
  },
  hashString(key: string): string {
    return hash(key);
  },
  getMysqlPool(): Pool {
    return GlobalStore.getItem<Pool>("dbConnection");
  },
  ucFirst(string: string) {
    if (!string) {
      return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  },
  ucWords(string: string) {
    if (!string) {
      return "";
    }
    return string
      .toLowerCase()
      .replace(/(?<= )[^\s]|^./g, a => a.toUpperCase());
  },
  replaceAllString(str: string, find: string, replace: string) {
    function escapeRegExp(string: string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    }
    return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
  },
  manageError(errorMessage: ApplicationError) {
    Logger.error(errorMessage.toString());
    this.debug(errorMessage);
  },
  dateToTimeStamp(dateInstance: moment.Moment | undefined): number | undefined {
    if (moment.isMoment(dateInstance)) {
      return dateInstance.valueOf();
    }
  },
  castMysqlRecordsToArray<ResultsType>(rows: any): ResultsType[] | undefined {
    if (Array.isArray(rows)) {
      return rows[0];
    }
  },
  castMysqlRecordToObject<ResultsType>(rows: any): ResultsType | undefined {
    const [data] = rows;
    if (Array.isArray(data)) {
      return data[0];
    }
    return data;
  },
  shortId() {
    return `_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  },
  debug(variable: any) {
    console.log(util.inspect(variable, false, null, true /* enable colors */));
  },
  createTimeOutPromise(delayMs: number) {
    return new Promise(resolve => {
      setTimeout(() => resolve("timeout"), delayMs);
    });
  },
  async fetchPageData(url: string) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
};
