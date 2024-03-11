import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { AuctionCreateDto } from './dto/incoming/auction-create-dto.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuctionService } from './auction.service';
import { SingleAuctionDto } from './dto/outgoing/single-auction.dto';
import { Auction } from './domain/auction';

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

  @Get('/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'If the auction is found',
    type: SingleAuctionDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'If the auction is not found',
  })
  public async getAnAuction(
    @Param('id') auctionId: string,
  ): Promise<SingleAuctionDto | null> {
    try {
      const domain = await this.auctionService.findById(auctionId);

      if (!domain) {
        throw new NotFoundException('Auction not found');
      }

      return domain ? this.mapAuctionDomainToSingleDto(domain) : null;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }
  }

  private mapAuctionDomainToSingleDto(auction: Auction): SingleAuctionDto {
    return <SingleAuctionDto>{
      id: auction.id,
      name: auction.name,
      state: auction.state,
      limits: auction.limits,
      startAt: auction.startAt,
      endedAt: auction.endedAt,
      item: {
        id: auction.item.id,
        name: auction.item.name,
        price: auction.item.price,
        currency: {
          id: auction.item.currency.id,
          code: auction.item.currency.code,
          symbol: auction.item.currency.symbol,
        },
        category: {
          id: auction.item.category.id,
          name: auction.item.category.name,
        },
      },
    };
  }
}
