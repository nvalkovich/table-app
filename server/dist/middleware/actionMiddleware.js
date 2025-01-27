"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const types_1 = require("../types/types");
const resources_1 = __importDefault(require("../resources"));
const { errors: errorMessages } = resources_1.default;
const actionMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return respondUnauthorized(res, errorMessages.auth.invalidToken);
    }
    if (!process.env.JWT_SECRET) {
        return res
            .status(types_1.StatusCodes.internalServerError)
            .json({ message: errorMessages.internalServerError });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOneBy({ id: decoded.id });
        if (!user || user.status === User_1.UserStatus.blocked) {
            return respondUnauthorized(res, user
                ? errorMessages.auth.unauthorized
                : errorMessages.auth.userNotFound);
        }
        req.user = user;
        next();
    }
    catch (error) {
        return respondUnauthorized(res, errorMessages.auth.invalidToken);
    }
};
exports.actionMiddleware = actionMiddleware;
function respondUnauthorized(res, message) {
    return res
        .status(types_1.StatusCodes.unauthorized)
        .json({ message, redirectToLogin: true });
}
