import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { StatusCodes, UserStatus } from "../types/types";
import resources from "../resources";

const { errors: errorMessages } = resources;

interface JwtPayload {
  id: number;
}

export const actionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return respondUnauthorized(res, errorMessages.auth.invalidToken);
  }

  if (!process.env.JWT_SECRET) {
    return res
      .status(StatusCodes.internalServerError)
      .json({ message: errorMessages.internalServerError });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ id: decoded.id });

    if (!user || user.status === UserStatus.blocked) {
      return respondUnauthorized(
        res,
        user
          ? errorMessages.auth.unauthorized
          : errorMessages.auth.userNotFound,
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return respondUnauthorized(res, errorMessages.auth.invalidToken);
  }
};

function respondUnauthorized(res: Response, message: string) {
  return res
    .status(StatusCodes.unauthorized)
    .json({ message, redirectToLogin: true });
}
