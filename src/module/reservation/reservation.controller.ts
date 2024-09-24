import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { WebResponse } from '../../model/web.model';
import {
  CreateReservationRequest,
  ReservationResponse,
  ReservationRequest,
} from '../../model/reservation.model';
import { Auth } from '../../common/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Auth() user: User,
    @Body() request: CreateReservationRequest,
  ): Promise<WebResponse<ReservationResponse>> {
    const result = await this.reservationService.create(request);
    return {
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  async search(
    @Auth() user: User,
    @Query('username') username?: string,
    @Query('receipt', ParseIntPipe) receipt?: number,
    @Query('reserved_time') reserved_time?: string,
    @Query('status', ParseIntPipe) status?: number,
    @Query('id_table', ParseIntPipe) id_table?: number,
  ): Promise<WebResponse<ReservationResponse[]>> {
    const request: ReservationRequest = {
      username: username,
      receipt: receipt,
      reserved_time: reserved_time,
      status: status,
      id_table: id_table,
    };

    return this.reservationService.SearchReservation(request);
  }

  @Patch('/:reservationId')
  @HttpCode(200)
  async updateUser(
    @Auth() user: User,
    @Param('reservationId', ParseIntPipe) reservationId: number,
  ): Promise<WebResponse<ReservationResponse>> {
    const result =
      await this.reservationService.updateReservation(reservationId);
    return {
      data: result,
    };
  }
}
