import { IsEmail, IsString, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
    @IsEmail({}, { message: 'Invalid email' })
    @IsNotEmpty({ message: 'Email is required field' })
    email!: string;

    @IsString({ message: 'Must be a string' })
    @IsNotEmpty({ message: 'Name is required field' })
    name!: string;

    @IsNotEmpty({ message: 'Password is required' })
    password!: string;
}