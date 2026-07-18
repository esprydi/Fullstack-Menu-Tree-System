import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMenuDto {
  @ApiPropertyOptional({ description: 'The new name of the menu item', example: 'Advanced System Management' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}
