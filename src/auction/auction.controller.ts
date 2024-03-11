import {
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { AuctionCreateDto } from './dto/incoming/auction-create-dto.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuctionService } from './auction.service';

@Controller('auction')
@ApiTags('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post('/')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'In case of successfull creation, returns the ID of the created auction',
    type: String,
  })
  public async createAuction(@Body() body: AuctionCreateDto): Promise<string> {
    try {
      return await this.auctionService.create(body);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
