import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '../../types';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(['delivery', 'client'], {
    message: 'Role must be either delivery or client',
  })
  role: Role;
}
