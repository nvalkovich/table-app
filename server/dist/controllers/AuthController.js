"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const RegisterUserDto_1 = require("../dto/RegisterUserDto");
const UserService_1 = require("../services/UserService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("../types/types");
const resources_1 = __importDefault(require("../resources"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const loginUserDto_1 = require("../dto/loginUserDto");
const { errors: errorMessages } = resources_1.default;
class AuthController {
    static async register(req, res) {
        const { email, name, password } = req.body;
        const validateErrors = await AuthController.validateRegisterData({
            email,
            name,
            password,
        });
        if (validateErrors) {
            return res.status(validateErrors.statusCode).json(validateErrors.json);
        }
        try {
            const user = await UserService_1.UserService.register({ email, name, password });
            const token = AuthController.jwtSign(user);
            const userResponse = { ...user, password: undefined };
            res.status(types_1.StatusCodes.created).json({ user: userResponse, token });
        }
        catch (error) {
            res
                .status(types_1.StatusCodes.badRequest)
                .json(error instanceof Error
                ? { message: error.message }
                : { message: errorMessages.unknown });
        }
    }
    static async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await UserService_1.UserService.findByEmail(email);
            const validateErrors = await AuthController.validateLoginData({
                email,
                password,
            });
            if (validateErrors) {
                return res.status(validateErrors.statusCode).json(validateErrors.json);
            }
            if (!user) {
                return res.status(types_1.StatusCodes.unauthorized).json({
                    message: errorMessages.auth.invalidCredentials,
                });
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(types_1.StatusCodes.unauthorized).json({
                    message: errorMessages.auth.invalidCredentials,
                });
            }
            await UserService_1.UserService.updateUser(user.id, { lastLoginAt: new Date() });
            const token = AuthController.jwtSign(user);
            const userResponse = { ...user, password: undefined };
            res.status(types_1.StatusCodes.ok).json({ user: userResponse, token });
        }
        catch (error) {
            res.status(types_1.StatusCodes.badRequest).json({
                message: error instanceof Error ? error.message : errorMessages.unknown,
            });
        }
    }
    static async getCurrentUser(req, res) {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(types_1.StatusCodes.unauthorized).json({
                message: errorMessages.auth.unauthorized,
            });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await UserService_1.UserService.findById(decoded.id);
            if (!user) {
                return res.status(types_1.StatusCodes.notFound).json({
                    message: errorMessages.auth.userNotFound,
                });
            }
            const { password, ...userData } = user;
            res.status(types_1.StatusCodes.ok).json(userData);
        }
        catch (error) {
            res.status(types_1.StatusCodes.internalServerError).json({
                message: errorMessages.internalServerError,
            });
        }
    }
    static jwtSign(user) {
        const { JWT_SECRET } = process.env;
        if (!JWT_SECRET) {
            throw new Error(errorMessages.auth.failedJWT);
        }
        return jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    }
    static async validateRegisterData(userData) {
        const registerDto = (0, class_transformer_1.plainToInstance)(RegisterUserDto_1.RegisterUserDto, userData);
        const errors = await (0, class_validator_1.validate)(registerDto);
        if (errors.length) {
            return {
                statusCode: types_1.StatusCodes.badRequest,
                json: {
                    message: errorMessages.validation.validationError,
                    errors: errors.map((err) => ({
                        property: err.property,
                        constraints: err.constraints,
                    })),
                },
            };
        }
    }
    static async validateLoginData(data) {
        const loginDto = (0, class_transformer_1.plainToInstance)(loginUserDto_1.LoginUserDto, data);
        const errors = await (0, class_validator_1.validate)(loginDto);
        if (errors.length) {
            return {
                statusCode: types_1.StatusCodes.badRequest,
                json: {
                    message: errorMessages.validation.validationError,
                    errors: errors.map((err) => ({
                        property: err.property,
                        constraints: err.constraints,
                    })),
                },
            };
        }
    }
}
exports.AuthController = AuthController;
