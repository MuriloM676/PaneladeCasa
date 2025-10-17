import { IsString, IsNumber, IsOptional, IsArray, IsEnum, Min } from 'class-validator';

export enum DishTypeDto {
  READY = 'READY',
  ALACARTE = 'ALACARTE',
}

export class CreateDishDto {
  @IsString()
  chefId!: string;

  @IsEnum(DishTypeDto)
  type!: DishTypeDto;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredients?: string[];

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  prepMinutes?: number;
}

export class UpdateDishDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredients?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  prepMinutes?: number;
}
