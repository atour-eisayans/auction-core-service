import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AuctionCreateDto } from './dto/incoming/auction-create.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuctionService } from './auction.service';
import { SingleAuctionDto } from './dto/outgoing/single-auction.dto';
import { Auction } from './domain/auction';
import { AuctionsListFilterDto } from './dto/incoming/auctions-list-filter.dto';
import { AuctionsListResponseDto } from './dto/outgoing/auctions-list-response.dto';
import { AuctionUpdateDto } from './dto/incoming/auction-update.dto';

@Controller('api/v1/auction')
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
      return await this.auctionService.createAuction(body);
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
      currentPrice: auction.currentPrice,
      item: {
        id: auction.item.id,
        name: auction.item.name,
        price: auction.item.price,
        ticketConfiguration: {
          id: auction.item.ticketConfiguration.id,
          currency: auction.item.ticketConfiguration.currency,
          raisingAmount: auction.item.ticketConfiguration.raisingAmount,
          unitPrice: auction.item.ticketConfiguration.unitPrice,
        },
        category: {
          id: auction.item.category.id,
          name: auction.item.category.name,
        },
      },
    };
  }

  @Get('/')
  @ApiResponse({
    status: HttpStatus.OK,
    type: AuctionsListResponseDto,
  })
  public async getListOfAuctions(
    @Query() filter: AuctionsListFilterDto,
  ): Promise<AuctionsListResponseDto> {
    try {
      const { auctions, totalCount } = await this.auctionService.findAll(
        filter,
      );
      return {
        items: auctions,
        page: filter.page,
        limit: filter.limit,
        totalCount: totalCount,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Put('/:id')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async auctionUpdate(
    @Body() body: AuctionUpdateDto,
    @Param('id') auctionId: string,
  ): Promise<void> {
    try {
      return await this.auctionService.updateAuction(auctionId, body);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('/:id/start')
  public async startAuction(@Param('id') auctionId: string): Promise<void> {
    try {
      await this.auctionService.startAuction(auctionId);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
