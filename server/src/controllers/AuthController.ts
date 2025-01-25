import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RegisterUserDto } from '../dto/RegisterUserDto';
import {userCreatingData, UserService} from '../services/UserService';
import jwt from 'jsonwebtoken';
import { StatusCodes } from "../types";
import resources from "../resources";
import { User } from "../entities/User";

interface ValidationError {
    statusCode: StatusCodes;
    json: {
        message: string,
        errors: {
            property: string,
            constraints: {[p: string]: string} | undefined;
        }[]
    }
}

const errorMessages = resources.errors;

export class AuthController {
    static async register(req: Request, res: Response) {
        const { email, name, password } = req.body;

        const validateErrors = await AuthController.validateUserData({email, name, password});
        if (validateErrors) {
            return res.status(validateErrors.statusCode).json(validateErrors.json);
        }

        try {
            const user = await UserService.register({email, name, password});
            const token = AuthController.jwtSign(user)
            const userResponse = { ...user, password: undefined };

            res.status(StatusCodes.created).json({ user: userResponse, token });
        } catch (error) {
            res.status(StatusCodes.badRequest).json(error instanceof Error ? { message: error.message } : { message: errorMessages.unknown });
        }
    }

    private static jwtSign(user: User) {
        const { JWT_SECRET } = process.env;

        if (!JWT_SECRET) {
            throw new Error(errorMessages.auth.failedJWT);
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        return token;
    }

    private static async validateUserData(userData: userCreatingData): Promise<void | ValidationError>
    {
        const registerDto = plainToInstance(RegisterUserDto, userData);

        const errors = await validate(registerDto);
        if (errors.length) {
            return {
                statusCode: StatusCodes.badRequest,
                json: {
                    message: errorMessages.validation.validationError,
                    errors: errors.map(err => ({
                        property: err.property,
                        constraints: err.constraints,
                    })),
                }
            }
        }
    }
}