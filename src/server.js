import express from "express";
import cors from 'cors';
import morgan from 'morgan';
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { getPaths } from "./helpers/utils.js";
import path from "path";
import contactRouter from "./contacts/contacts.router.js";
import userRouter from './users/user.router.js';

export class ContactsServer {
  constructor() {
    this.server = null;
    this.port = 3000;
  }

  async start() {
    this.initServer();
    this.initConfig();
    await this.initDatabase();
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
    dotenv.config({ path: path.join(__dirname, ".env") });
  }
  
    async initDatabase() {
      try {
        await mongoose.connect(process.env.MONGODB_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        });
  
        console.log("Database connection successful");
      } catch (error) {
        console.log(`MongoDB error: ${error.message}`);
        process.exit(1);
      }
    }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(morgan("combined"));
    this.server.use(cors({ origin: `http://localhost:${this.port}` }));
  }

  initRoutes() {
		this.server.use('/api/auth', userRouter);
		this.server.use('/api/contacts', contactRouter);
		this.server.use('/api/users', userRouter);
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
