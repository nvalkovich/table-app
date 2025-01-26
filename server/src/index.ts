import express from "express";
import { AppDataSource } from "./data-source";
import "reflect-metadata";
import { AuthController } from "./controllers/AuthController";
import resources from "./resources";
import { Routes } from "./types";

const app = express();
const port = 3000;

const serverMessages = resources.messages.server;
const errorMessages = resources.errors;
const localhost = `http://localhost:${port}`;

app.use(express.json());
app.post(Routes.register, AuthController.register);
app.post(Routes.login, AuthController.login);

app.get(Routes.base, (req, res) => {
  res.send(serverMessages.serverWorks);
});

AppDataSource.initialize()
  .then(() => {
    console.log(serverMessages.dbConnected);

    app.listen(port, () => {
      console.log(`${serverMessages.serverRunning} ${localhost}`);
    });
  })
  .catch((error) => {
    console.error(`${errorMessages.error}`, error);
  });
