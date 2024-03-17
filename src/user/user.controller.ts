import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { GetUserTicketBalanceDto } from './dto/incoming/get-user-ticket-balance.dto';
import { UserTicketBalance } from './domain/user-ticket-balance';
import { UserTicketBalanceDto } from './dto/outgoing/user-ticket-balance.dto';
import { IncreaseUserTicketBalanceDto } from './dto/incoming/increase-user-ticket-balance.dto';

@Controller('api/v1/user')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:userId/ticket-balance')
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserTicketBalanceDto,
  })
  public async getUserTicketBalance(
    @Param('userId') userId: string,
    @Query() payload: GetUserTicketBalanceDto,
  ): Promise<UserTicketBalanceDto> {
    try {
      const userTicketBalance = await this.userService.getUserTicketBalance(
        userId,
        payload.ticketTypeId,
      );

      if (!userTicketBalance) {
        throw new NotFoundException(
          'User information is not provided correctly',
        );
      }

      return this.mapUserTicketBalanceDomainToDto(userTicketBalance);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }
  }

  private mapUserTicketBalanceDomainToDto(
    domain: UserTicketBalance,
  ): UserTicketBalanceDto {
    return <UserTicketBalanceDto>{
      id: domain.id,
      balance: domain.balance,
      ticketType: {
        id: domain.ticketType.id,
        currency: {
          id: domain.ticketType.currency.id,
          symbol: domain.ticketType.currency.symbol,
          code: domain.ticketType.currency.code,
        },
        raisingAmount: domain.ticketType.raisingAmount,
        unitPrice: domain.ticketType.unitPrice,
      },
    };
  }

  @Patch('/:userId/ticket-balance')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the new balance of the user',
    type: Number,
  })
  public async increaseUserTicketBalance(
    @Param('userId') userId: string,
    @Body() payload: IncreaseUserTicketBalanceDto,
  ): Promise<number> {
    try {
      const newBalance = await this.userService.increaseUserTicketBalance(
        userId,
        payload.ticketTypeId,
        payload.quantity,
      );

      if (newBalance === null) {
        throw new NotFoundException(
          'User information is not provided correctly',
        );
      }

      return newBalance;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }
  }
}
