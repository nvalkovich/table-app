import { IsNotEmpty } from "class-validator";

export class LoginUserDto {
  @IsNotEmpty({ message: "Email is required field" })
  email!: string;

  @IsNotEmpty({ message: "Password is required field" })
  password!: string;
}
