import { IsString, IsNumber, IsArray, ValidateNested, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  dishId!: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsNumber()
  @Min(0)
  unitPrice!: number;

  @IsOptional()
  customizations?: any;
}

export class CreateOrderDto {
  @IsString()
  customerId!: string;

  @IsString()
  chefId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsString()
  deliveryAddress!: string;

  @IsNumber()
  @Min(0)
  deliveryFee!: number;

  @IsString()
  paymentMethod!: 'MOCK' | 'STRIPE' | 'PAGSEGURO';
}

export class CalculatePlateDto {
  @IsArray()
  @IsString({ each: true })
  menuItemIds!: string[];
}
