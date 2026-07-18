import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ReorderMenuDto {
  @ApiProperty({ description: 'The new order position of the menu item', example: 0 })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  order: number;
}
