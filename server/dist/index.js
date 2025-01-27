"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./data-source");
require("reflect-metadata");
const AuthController_1 = require("./controllers/AuthController");
const resources_1 = __importDefault(require("./resources"));
const types_1 = require("./types/types");
const UserController_1 = require("./controllers/UserController");
const actionMiddleware_1 = require("./middleware/actionMiddleware");
const app = (0, express_1.default)();
const port = 3000;
const serverMessages = resources_1.default.messages.server;
const errorMessages = resources_1.default.errors;
const localhost = `http://localhost:${port}`;
app.use(express_1.default.json());
app.post(types_1.Routes.register, AuthController_1.AuthController.register);
app.post(types_1.Routes.login, AuthController_1.AuthController.login);
app.get(types_1.Routes.currentUser, AuthController_1.AuthController.getCurrentUser);
app.get(types_1.Routes.users, UserController_1.UserController.getUsers);
app.patch(types_1.Routes.blockUsers, actionMiddleware_1.actionMiddleware, UserController_1.UserController.blockUsers);
app.patch(types_1.Routes.unblockUsers, actionMiddleware_1.actionMiddleware, UserController_1.UserController.unblockUsers);
app.post(types_1.Routes.deleteUsers, actionMiddleware_1.actionMiddleware, UserController_1.UserController.deleteUsers);
app.get(types_1.Routes.base, (req, res) => {
    res.send(serverMessages.serverWorks);
});
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log(serverMessages.dbConnected);
    app.listen(port, () => {
        console.log(`${serverMessages.serverRunning} ${localhost}`);
    });
})
    .catch((error) => {
    console.error(`${errorMessages.error}`, error);
});
