import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export enum CreateUserRole {
  CUSTOMER = 'CUSTOMER',
  CHEF = 'CHEF',
}

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(CreateUserRole)
  role!: CreateUserRole;
}
