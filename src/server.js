import express from "express";
import cors from 'cors';
import morgan from 'morgan';
import dotenv from "dotenv";
import { getPaths } from "./helpers/utils.js";
import path from "path";
import contactRouter from "./contacts/contacts.controller.js";

export class ContactsServer {
  constructor() {
    this.server = null;
    this.port = 3000;
  }

  start() {
    this.initServer();
    this.initConfig();
    this.initMiddlewares();
    this.initRoutes();
    this.initErrorHandler();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initConfig() {
    const { __dirname } = getPaths(import.meta.url);
    dotenv.config({ path: path.join(__dirname, "../.env") });
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(morgan("combined"));
    this.server.use(cors({ origin: `http://localhost:${this.port}` }));
  }

  initRoutes() {
    this.server.use("/api/contacts", contactRouter);
  }

  initErrorHandler() {
    this.server.use((err, req, res, next) => {
      const statusCode = err.status || 500;
      res.status(statusCode).send(err.message);
    });
  }

  startListening() {
    this.server.listen(this.port, () => {
      console.log("Server started listening on port", this.port);
    });
  }
}
