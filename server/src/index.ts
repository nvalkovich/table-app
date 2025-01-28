import express from "express";
import { AppDataSource } from "./data-source";
import "reflect-metadata";
import { AuthController } from "./controllers/AuthController";
import resources from "./resources";
import { Routes, ApiRoutes } from "./types/types";
import { UserController } from "./controllers/UserController";
import { actionMiddleware } from "./middleware/actionMiddleware";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;

const serverMessages = resources.messages.server;
const errorMessages = resources.errors;
const localhost = `http://localhost:${port}`;

app.use(express.json());

const staticFilesPath = path.join(__dirname, "../../client/dist"); // Путь к статическим файлам
app.use(express.static(staticFilesPath));

app.post(ApiRoutes.register, AuthController.register);
app.post(ApiRoutes.login, AuthController.login);

app.get(Routes.register, (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

app.get(Routes.login, (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

app.get(ApiRoutes.currentUser, AuthController.getCurrentUser);
app.get(ApiRoutes.users, UserController.getUsers);

app.patch(ApiRoutes.blockUsers, actionMiddleware, UserController.blockUsers);
app.patch(
  ApiRoutes.unblockUsers,
  actionMiddleware,
  UserController.unblockUsers,
);
app.post(ApiRoutes.deleteUsers, actionMiddleware, UserController.deleteUsers);

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
