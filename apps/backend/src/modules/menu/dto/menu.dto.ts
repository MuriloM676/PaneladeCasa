import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minSelect?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxSelect?: number;
}

export class CreateMenuItemDto {
  @IsString()
  name!: string;

  @IsNumber()
  @Min(0)
  price!: number;
}
