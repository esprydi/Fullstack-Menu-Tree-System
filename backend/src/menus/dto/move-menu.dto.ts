import { IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MoveMenuDto {
  @ApiPropertyOptional({ description: 'The ID of the new parent menu (null to move to root)', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsOptional()
  @IsUUID()
  parentId?: string; // null/undefined jika dipindahkan ke root
}
