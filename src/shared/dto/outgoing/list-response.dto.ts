import { ApiProperty } from '@nestjs/swagger';

export class ListResponseDto {
  @ApiProperty({
    description: 'Array of the found items',
    isArray: true,
  })
  items: unknown[];

  @ApiProperty({
    description: 'Current page',
    type: Number,
  })
  page: number;

  @ApiProperty({
    description: 'Current limit',
    type: Number,
  })
  limit: number;

  @ApiProperty({
    description: 'Total items count',
    type: Number,
  })
  totalCount: number;
}
