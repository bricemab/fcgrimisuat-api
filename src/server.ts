import fs from "fs";
import path from "path";
import fileUpload from "express-fileupload";
import { createPool } from "mysql2";
import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import express, { Request, Response } from "express";
import morgan from "morgan";
import jwt from "jsonwebtoken";
import * as cheerio from "cheerio";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import localData from "dayjs/plugin/localeData.js";
import Logger from "./utils/Logger";
import Utils from "./utils/Utils";
import UserRouter from "./routes/UserRouter";
import GlobalStore from "./utils/GlobalStore";
import {
  AuthenticationErrors,
  GeneralErrors,
  UserErrors
} from "./modules/Global/BackendErrors";
import TokenManager from "./modules/Global/TokenManager";
import config from "./config/config";

import AclManager from "./permissions/AclManager";
import { Permission } from "./permissions/permissions";
import RequestManager from "./modules/Global/RequestManager";
import { ApplicationRequest } from "./utils/Types";
import "dayjs/locale/fr.js";

dayjs.extend(customParseFormat);
dayjs.extend(localData);
dayjs.locale("fr");

const app = express();
const setup = async () => {
  Logger.verbose(`Setup started`);
  app.use(
    morgan("combined", {
      stream: fs.createWriteStream(
        path.join(
          __dirname,
          `../logs/http/access_${Utils.generateCurrentDateFileName()}.log`
        ),
        {
          flags: "a"
        }
      )
    })
  );

  app.use(compression());
  app.use(fileUpload());
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(cors());
  app.set("trust proxy", 1); // trust first proxy
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views").replace("dist", "src"));
  app.use("/js", (req: any, res: any) => {
    const file = path.join(`${__dirname}`, "..", "/node_modules/", req.url);
    if (fs.existsSync(file)) {
      res.sendFile(file);
    } else {
      res.render("templates/index", {
        title: "FC Grimisuat - Page introuvable",
        body: "../not-found"
      });
    }
  });
  app.use("/css", (req: any, res: any) => {
    const file = path
      .join(`${__dirname}`, "/assets/", req.url)
      .replace("dist", "src");
    if (fs.existsSync(file)) {
      res.sendFile(file);
    } else {
      res.render("templates/index", {
        title: "FC Grimisuat - Page introuvable",
        body: "../not-found"
      });
    }
  });
  app.use(TokenManager.buildSessionToken);

  GlobalStore.addItem("config", config);

  const pool = await createPool({
    host: config.database.host,
    user: config.database.user,
    database: config.database.database,
    password: config.database.password,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
  });

  function keepAlive() {
    pool.getConnection((err, connection) => {
      if (err) {
        return;
      }
      connection.query("SELECT 1", (error, rows) => {
        connection.end();
        if (error) {
          console.log(`QUERY ERROR: ${error}`);
        }
      });
    });
  }

  setInterval(keepAlive, 1000 * 60 * 60);

  const promisePool = await pool.promise();
  GlobalStore.addItem("dbConnection", promisePool);
};
setup()
  .then(() => {
    Logger.verbose(`Setup finish with success`);
    app.use("/users", UserRouter);
    app.get("/calendar/:id", async (request: Request, response: Response) => {
      response.render("templates/index", {
        title: "FC Grimisuat - Calendrier",
        body: "../calendar"
      });
    });
    app.get(
      "/calendar-list/:id",
      async (request: Request, response: Response) => {
        const calenderUrl =
          "https://matchcenter.avf-wfv.ch/default.aspx?oid=17&lng=2&v=976&t=34389&ls=23172&sg=64957&a=pt";
        const html = await Utils.fetchPageData(calenderUrl);
        const $ = cheerio.load(html);

        const matches: any = [];
        let lastContest = {};

        $(
          "#ctl05_VereinMasterObjectID_ctl02_tbResultate.list-group .list-group-item"
        ).each((index: number, element) => {
          if ($(element).hasClass("sppTitel")) {
            const contestName = $(element)
              .text()
              .trim();
            const contest = { isContest: true, name: contestName };
            lastContest = contest;
            matches.push(contest);
          } else {
            const teamA = $(element)
              .find(".teamA")
              .text()
              .trim();
            const teamB = $(element)
              .find(".teamB")
              .text()
              .trim();
            const goalA = $(element)
              .find(".torA")
              .text()
              .trim();
            const goalB = $(element)
              .find(".torB")
              .text()
              .trim();
            const status = $(element)
              .find(".telegramm-link")
              .text()
              .trim();

            if (status === "R") {
              console.log($(element).find(".telegramm-link"));
            }
            let dateString = $(element)
              .find(".date")
              .text()
              .trim();
            dateString = dateString.substring(3);
            const date = dayjs(
              dateString,
              "DD.MM.YYYYHH:mm".substring(0, dateString.length)
            );
            const match = {
              isContest: false,
              teamA,
              teamB,
              goalA,
              goalB,
              status,
              contest: lastContest,
              date: Utils.ucFirst(date.format("dddd DD.MM.YYYY HH:mm"))
            };
            matches.push(match);
          }
        });
        response.json({ matches });
      }
    );

    app.get("*", (req: Request, res: Response) => {
      res.json({ state: "Page dont exist" });
    });
    Logger.verbose(`Server starting`);
    app.listen(config.server.port, "0.0.0.0", () => {
      const protocol = config.isDevModeEnabled ? "http" : "http";
      Logger.info(
        `FC GRIMISUAT BACKEND is now running on ${protocol}://${config.server.hostName}:${config.server.port}`
      );
    });

    app.on("error", (error: any) => {
      Utils.manageError({
        code: GeneralErrors.UNHANDLED_ERROR,
        message: `Error occurred in express: ${error}`
      });
    });
  })
  .catch(error => {
    Logger.warn(`Setup finish with errors`);
    Utils.manageError(error);
  });
