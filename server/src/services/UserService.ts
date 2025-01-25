import { User } from '../entities/User';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source';
import {Repository} from "typeorm";
import resources from "../resources";

export interface userCreatingData {
    email: string;
    name: string;
    password: string;
}

export class UserService {
    private static userRepository: Repository<User>;

    static async register({email, name, password}: userCreatingData) {
      const userRepository = AppDataSource.getRepository(User);
      this.userRepository = userRepository;

      await this.isUserExist(email);

      const hashedPassword  = await this.createHash(password);
      const user = this.createUser({ email, name, password: hashedPassword });

      return userRepository.save(user);
    }

    private static async isUserExist (email: string) {
        const existingUser = await this.userRepository.findOne({ where: { email } });

        if (existingUser) {
            throw new Error(resources.errors.auth.userExist);
        }
    }

    private static async createHash (value: string) {
        const SALT_ROUNDS = 10;

        return await bcrypt.hash(value, SALT_ROUNDS);
    }

    private static createUser (userData: userCreatingData ) {
        return this.userRepository.create(userData)
    }
}