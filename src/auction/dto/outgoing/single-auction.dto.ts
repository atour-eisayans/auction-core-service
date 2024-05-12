import { ApiProperty } from '@nestjs/swagger';
import { SingleItemDto } from '../../../item/dto/outgoing/single-item.dto';
import { LocalizedString } from '../../../shared/domain/localized-string';
import { AuctionState } from '../../../shared/enum/auction-state.enum';
import { AuctionLimit } from '../../../auction/domain/auction';

export class SingleAuctionDto {
  @ApiProperty({
    description: 'ID of the auction',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Item in the auction',
    type: SingleItemDto,
  })
  item: SingleItemDto;

  @ApiProperty({
    description: 'Current auction price',
    type: Number,
  })
  currentPrice?: number;

  @ApiProperty({
    description: 'Localized name of the auction',
    type: 'object',
  })
  name: LocalizedString;

  @ApiProperty({
    description: 'State of the auction',
    enum: AuctionState,
  })
  state: AuctionState;

  @ApiProperty({
    description: 'Start date of the auction',
    type: Date,
  })
  startAt?: Date;

  @ApiProperty({
    description: 'End date of the auction',
    type: Date,
  })
  endedAt?: Date;

  @ApiProperty({
    description: 'Limits of the auction',
    type: 'object',
  })
  limits?: AuctionLimit;
}
