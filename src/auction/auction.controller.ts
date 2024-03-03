import { Body, Controller, Post } from '@nestjs/common';
import { AuctionCreateDto } from './dto/incoming/auction-create-dto.dto';

@Controller('auction')
export class AuctionController {
  @Post()
  createAuction(@Body() body: AuctionCreateDto) {
    return 'hello auction';
  }
}
