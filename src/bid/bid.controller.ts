import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BidService } from './bid.service';
import { PlaceBidDto } from './dto/incoming/place-bid.dto';

@Controller('api/v1/bid')
@ApiTags('bids')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post('/')
  @ApiResponse({
    description: 'Total bids placed by the user in the auction',
    type: Number,
  })
  public async place(@Body() payload: PlaceBidDto): Promise<number> {
    try {
      return await this.bidService.placeBid(payload.auctionId, payload.userId);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
