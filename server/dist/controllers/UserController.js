"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const types_1 = require("../types/types");
const resources_1 = __importDefault(require("../resources"));
const { errors: errorMessages, messages } = resources_1.default;
class UserController {
    static async updateUserStatuses(ids, status) {
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        await userRepository.update(ids, { status });
    }
    static async deleteUsersByIds(ids) {
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        await userRepository.delete(ids);
    }
    static sendErrorResponse(res, message) {
        res.status(types_1.StatusCodes.internalServerError).json({ message });
    }
    static sendSuccessResponse(res, message, additionalData = {}) {
        res.status(types_1.StatusCodes.ok).json({ message, ...additionalData });
    }
    static async getUsers(req, res) {
        try {
            const users = await data_source_1.AppDataSource.getRepository(User_1.User).find();
            this.sendSuccessResponse(res, messages.user.got, { users });
        }
        catch {
            this.sendErrorResponse(res, errorMessages.internalServerError);
        }
    }
    static async blockUsers(req, res) {
        await this.handleAction(req, res, User_1.UserStatus.blocked, messages.user.blocked);
    }
    static async unblockUsers(req, res) {
        await this.handleAction(req, res, User_1.UserStatus.active, messages.user.unblocked);
    }
    static async deleteUsers(req, res) {
        try {
            const { ids } = req.body;
            await this.deleteUsersByIds(ids);
            const redirect = ids.includes(req?.user?.id);
            this.sendSuccessResponse(res, messages.user.deleted, redirect ? { redirectToRegister: true } : {});
        }
        catch {
            this.sendErrorResponse(res, errorMessages.internalServerError);
        }
    }
    static async handleAction(req, res, status, successMessage) {
        try {
            const { ids } = req.body;
            await this.updateUserStatuses(ids, status);
            this.sendSuccessResponse(res, successMessage);
        }
        catch {
            this.sendErrorResponse(res, errorMessages.internalServerError);
        }
    }
}
exports.UserController = UserController;
