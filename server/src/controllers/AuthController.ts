import { Request, Response } from "express";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { RegisterUserDto } from "../dto/RegisterUserDto";
import { userCreatingData, UserService } from "../services/UserService";
import jwt from "jsonwebtoken";
import { StatusCodes } from "../types";
import resources from "../resources";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import { LoginUserDto } from "../dto/loginUserDto";

interface ValidationError {
  statusCode: StatusCodes;
  json: {
    message: string;
    errors: {
      property: string;
      constraints: { [p: string]: string } | undefined;
    }[];
  };
}

const { errors: errorMessages } = resources;

export class AuthController {
  static async register(req: Request, res: Response) {
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
      const user = await UserService.register({ email, name, password });
      const token = AuthController.jwtSign(user);
      const userResponse = { ...user, password: undefined };

      res.status(StatusCodes.created).json({ user: userResponse, token });
    } catch (error) {
      res
        .status(StatusCodes.badRequest)
        .json(
          error instanceof Error
            ? { message: error.message }
            : { message: errorMessages.unknown },
        );
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    console.log("приходят данные", email, password);

    const validateErrors = await AuthController.validateLoginData({
      email,
      password,
    });
    if (validateErrors) {
      console.log("ОШИБКИ ВАЛИДАЦИИ", validateErrors);
      return res.status(validateErrors.statusCode).json(validateErrors.json);
    }

    try {
      const user = await UserService.findByEmail(email);
      console.log("findByEmail", user);
      if (!user) {
        console.log("no user", user);
        return res.status(StatusCodes.unauthorized).json({
          message: errorMessages.auth.invalidCredentials,
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(StatusCodes.unauthorized).json({
          message: errorMessages.auth.invalidCredentials,
        });
      }

      const token = AuthController.jwtSign(user);
      const userResponse = { ...user, password: undefined };

      res.status(StatusCodes.ok).json({ user: userResponse, token });
    } catch (error) {
      res
        .status(StatusCodes.badRequest)
        .json(
          error instanceof Error
            ? { message: error.message }
            : { message: errorMessages.unknown },
        );
    }
  }

  private static jwtSign(user: User) {
    const { JWT_SECRET } = process.env;

    if (!JWT_SECRET) {
      throw new Error(errorMessages.auth.failedJWT);
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    return token;
  }

  private static async validateRegisterData(
    userData: userCreatingData,
  ): Promise<void | ValidationError> {
    const registerDto = plainToInstance(RegisterUserDto, userData);

    const errors = await validate(registerDto);
    if (errors.length) {
      return {
        statusCode: StatusCodes.badRequest,
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

  private static async validateLoginData(data: {
    email: string;
    password: string;
  }): Promise<void | ValidationError> {
    const loginDto = plainToInstance(LoginUserDto, data);

    const errors = await validate(loginDto);
    if (errors.length) {
      return {
        statusCode: StatusCodes.badRequest,
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
