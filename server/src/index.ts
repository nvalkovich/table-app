import express from "express";
import { AppDataSource } from "./data-source";
import "reflect-metadata";
import { AuthController } from "./controllers/AuthController";
import resources from "./resources";
import { Routes } from "./types/types";
import { UserController } from "./controllers/UserController";
import { actionMiddleware } from "./middleware/actionMiddleware";

const app = express();
const port = 3000;

const serverMessages = resources.messages.server;
const errorMessages = resources.errors;
const localhost = `http://localhost:${port}`;

app.use(express.json());
app.post(Routes.register, AuthController.register);
app.post(Routes.login, AuthController.login);

app.get(Routes.currentUser, AuthController.getCurrentUser);
app.get(Routes.users, UserController.getUsers);

app.patch(Routes.blockUsers, actionMiddleware, UserController.blockUsers);
app.patch(Routes.unblockUsers, actionMiddleware, UserController.unblockUsers);
app.post(Routes.deleteUsers, actionMiddleware, UserController.deleteUsers);

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
