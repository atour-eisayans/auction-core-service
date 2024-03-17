import { ApiProperty } from '@nestjs/swagger';

export class PlaceBidDto {
  @ApiProperty({
    description: 'ID of the user',
    type: String,
    required: true,
  })
  userId!: string;

  @ApiProperty({
    description: 'ID of the auction',
    type: String,
    required: true,
  })
  auctionId!: string;
}
