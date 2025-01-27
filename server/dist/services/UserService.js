"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = require("../entities/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const data_source_1 = require("../data-source");
const resources_1 = __importDefault(require("../resources"));
class UserService {
    static async register({ email, name, password }) {
        await this.isUserExist(email);
        const hashedPassword = await this.createHash(password);
        const user = this.createUser({ email, name, password: hashedPassword });
        return this.userRepository.save(user);
    }
    static async isUserExist(email) {
        const existingUser = await this.findByEmail(email);
        if (existingUser) {
            throw new Error(resources_1.default.errors.auth.userExist);
        }
    }
    static async findByEmail(email) {
        return ((await UserService.userRepository.findOne({ where: { email } })) || null);
    }
    static async createHash(value) {
        const SALT_ROUNDS = 10;
        return await bcrypt_1.default.hash(value, SALT_ROUNDS);
    }
    static createUser(userData) {
        return this.userRepository.create(userData);
    }
    static async findById(id) {
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        return await userRepository.findOneBy({ id });
    }
    static async updateUser(id, updateData) {
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        await userRepository.update(id, updateData);
    }
}
exports.UserService = UserService;
_a = UserService;
(() => {
    _a.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
})();
