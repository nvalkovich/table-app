import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { StatusCodes, UserStatus } from "../types/types";
import resources from "../resources";

const { errors: errorMessages, messages } = resources;

export class UserController {
  static async updateUserStatuses(ids: number[], status: UserStatus) {
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.update(ids, { status });
  }

  static async deleteUsersByIds(ids: number[]) {
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.delete(ids);
  }

  static sendErrorResponse(res: Response, message: string) {
    res.status(StatusCodes.internalServerError).json({ message });
  }

  static sendSuccessResponse(res: Response, data = {}) {
    res.status(StatusCodes.ok).json(data);
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const users = await AppDataSource.getRepository(User).find();
      UserController.sendSuccessResponse(res, users);
    } catch {
      UserController.sendErrorResponse(res, errorMessages.internalServerError);
    }
  }

  static async blockUsers(req: Request, res: Response) {
    await UserController.handleAction(
      req,
      res,
      UserStatus.blocked,
      messages.user.blocked,
    );
  }

  static async unblockUsers(req: Request, res: Response) {
    await UserController.handleAction(
      req,
      res,
      UserStatus.active,
      messages.user.unblocked,
    );
  }

  static async deleteUsers(req: Request, res: Response) {
    try {
      const { ids } = req.body;
      await UserController.deleteUsersByIds(ids);

      const redirect = ids.includes(req.user?.id);
      UserController.sendSuccessResponse(
        res,
        redirect ? { redirectToRegister: true } : {},
      );
    } catch {
      UserController.sendErrorResponse(res, errorMessages.internalServerError);
    }
  }

  private static async handleAction(
    req: Request,
    res: Response,
    status: UserStatus,
    successMessage: string,
  ) {
    try {
      const { ids } = req.body;
      await UserController.updateUserStatuses(ids, status);
      UserController.sendSuccessResponse(res, { message: successMessage });
    } catch {
      UserController.sendErrorResponse(res, errorMessages.internalServerError);
    }
  }
}
