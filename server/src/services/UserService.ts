/// <reference path="../types/express.d.ts" />

import { User } from "../entities/User";
import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import resources from "../resources";
import { pgSQLDuplicateKeyErrorCode } from "../constants";
import { QueryFailedError } from "typeorm";

export interface userCreatingData {
  email: string;
  name: string;
  password: string;
}

export class UserService {
  private static userRepository: Repository<User>;

  static {
    this.userRepository = AppDataSource.getRepository(User);
  }

  static async register({ email, name, password }: userCreatingData) {
    try {
      const hashedPassword = await this.createHash(password);
      const user = this.createUser({ email, name, password: hashedPassword });

      await this.userRepository.save(user);
      return user;
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === pgSQLDuplicateKeyErrorCode
      ) {
        throw new Error(resources.errors.auth.userExist);
      }
      throw error;
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    return (
      (await UserService.userRepository.findOne({ where: { email } })) || null
    );
  }

  private static async createHash(value: string) {
    const SALT_ROUNDS = 10;

    return await bcrypt.hash(value, SALT_ROUNDS);
  }

  private static createUser(userData: userCreatingData) {
    return this.userRepository.create(userData);
  }

  static async findById(id: number): Promise<User | null> {
    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.findOneBy({ id });
  }

  static async updateUser(id: number, updateData: Partial<User>) {
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.update(id, updateData);
  }
}
