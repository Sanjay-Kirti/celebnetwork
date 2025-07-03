import { IsEmail, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../user.entity';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
} 