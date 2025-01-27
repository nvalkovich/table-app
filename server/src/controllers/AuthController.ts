import { Request, Response } from "express";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { RegisterUserDto } from "../dto/RegisterUserDto";
import { userCreatingData, UserService } from "../services/UserService";
import jwt from "jsonwebtoken";
import { StatusCodes, UserStatus } from "../types/types";
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

    const validateErrors = await validateRegisterData({
      email,
      name,
      password,
    });
    if (validateErrors) {
      return sendErrorResponse(res, validateErrors);
    }

    try {
      const user = await UserService.register({ email, name, password });
      const token = jwtSign(user);
      const userResponse = excludePassword(user);

      res.status(StatusCodes.created).json({ user: userResponse, token });
    } catch (error) {
      handleError(res, error, StatusCodes.badRequest);
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await UserService.findByEmail(email);

      const validateErrors = await validateLoginData({ email, password });
      if (validateErrors) {
        return sendErrorResponse(res, validateErrors);
      }

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return sendErrorResponse(res, {
          statusCode: StatusCodes.unauthorized,
          json: {
            message: errorMessages.auth.invalidCredentials,
            errors: [],
          },
        });
      }

      if (user.status === UserStatus.blocked) {
        return sendErrorResponse(res, {
          statusCode: StatusCodes.unauthorized,
          json: {
            message: errorMessages.auth.userBlocked,
            errors: [],
          },
        });
      }

      await UserService.updateUser(user.id, { lastLoginAt: new Date() });

      const token = jwtSign(user);
      const userResponse = excludePassword(user);

      res.status(StatusCodes.ok).json({ user: userResponse, token });
    } catch (error) {
      handleError(res, error, StatusCodes.badRequest);
    }
  }

  static async getCurrentUser(req: Request, res: Response) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return sendErrorResponse(res, {
        statusCode: StatusCodes.unauthorized,
        json: {
          message: errorMessages.auth.unauthorized,
          errors: [],
        },
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: number;
      };

      const user = await UserService.findById(decoded.id);

      if (!user) {
        return sendErrorResponse(res, {
          statusCode: StatusCodes.notFound,
          json: {
            message: errorMessages.auth.userNotFound,
            errors: [],
          },
        });
      }

      const userResponse = excludePassword(user);
      res.status(StatusCodes.ok).json(userResponse);
    } catch (error) {
      handleError(res, error, StatusCodes.internalServerError);
    }
  }
}

function jwtSign(user: User): string {
  const { JWT_SECRET } = process.env;

  if (!JWT_SECRET) {
    throw new Error(errorMessages.auth.failedJWT);
  }

  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
}

function excludePassword(user: User): Omit<User, "password"> {
  const { password, ...userData } = user;
  return userData;
}

async function validateRegisterData(
  userData: userCreatingData,
): Promise<ValidationError | void> {
  const registerDto = plainToInstance(RegisterUserDto, userData);
  return validateData(registerDto);
}

async function validateLoginData(data: {
  email: string;
  password: string;
}): Promise<ValidationError | void> {
  const loginDto = plainToInstance(LoginUserDto, data);
  return validateData(loginDto);
}

async function validateData(dto: object): Promise<ValidationError | void> {
  const errors = await validate(dto);

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

function sendErrorResponse(res: Response, error: ValidationError): Response {
  return res.status(error.statusCode).json(error.json);
}

function handleError(
  res: Response,
  error: unknown,
  statusCode: StatusCodes,
): Response {
  return res.status(statusCode).json({
    message: error instanceof Error ? error.message : errorMessages.unknown,
    errors: [],
  });
}
