import { ApiProperty } from '@nestjs/swagger';
import { ListResponseDto } from '../../../shared/dto/outgoing/list-response.dto';
import { SingleAuctionDto } from './single-auction.dto';

export class AuctionsListResponseDto extends ListResponseDto {
  @ApiProperty({
    description: 'Auctions found',
    type: SingleAuctionDto,
    isArray: true,
  })
  items: SingleAuctionDto[];
}
