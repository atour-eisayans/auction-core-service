import { ApiProperty } from '@nestjs/swagger';

export class SingleCurrencyDto {
  @ApiProperty({
    description: 'ID of the currency',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Symbol of the currency',
    type: String,
  })
  symbol: string;

  @ApiProperty({
    description: 'ISO-Code of the currency',
    type: String,
  })
  code: string;
}
