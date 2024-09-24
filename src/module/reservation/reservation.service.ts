import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  CreateReservationRequest,
  ReservationResponse,
  ReservationRequest,
} from '../../model/reservation.model';
import { WebResponse } from '../../model/web.model';
import { ValidationService } from '../../common/validation.service';
import { ReservationValidation } from './reservation.validation';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../../common/prisma.service';
//import { EmailService } from '../mail/mail.service';
import { Reservation } from '@prisma/client';

@Injectable()
export class ReservationService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    //private mailService: EmailService,
  ) {}

  async create(
    request: CreateReservationRequest,
  ): Promise<ReservationResponse> {
    this.logger.debug(`Create new Reservation ${JSON.stringify(request)}`);

    const createRequest: CreateReservationRequest =
      this.validationService.validate(ReservationValidation.CREATE, request);

    const tableIsAvailable = await this.checkTableAvailability(
      createRequest.id_table,
      createRequest.reserved_time,
    );

    if (!tableIsAvailable) {
      throw new HttpException('Table is not ready', 400);
    }

    const reservation = await this.prismaService.reservation.create({
      data: createRequest,
    });

    await this.prismaService.table.update({
      where: {
        id: request.id_table,
        status: 1,
      },
      data: {
        status: 2,
      },
    });

    /* 
        if (reservation){
          const emailData = {
            email : reservation.email,
            receipt : reservation.receipt,
          }
          await this.mailService.welcomeEmail(emailData);
        } 
        */

    return {
      receipt: reservation.receipt,
      reserved_time: reservation.reserved_time,
      id_table: reservation.id_table,
      status: reservation.status,
      username: reservation.username,
      email: reservation.email,
    };
  }

  async SearchReservation(
    request: ReservationRequest,
  ): Promise<WebResponse<ReservationResponse[]>> {
    const filters = [];

    const searchRequest: ReservationRequest = this.validationService.validate(
      ReservationValidation.SEARCH,
      request,
    );

    if (searchRequest.receipt) {
      filters.push({
        receipt: searchRequest.receipt,
      });
    }

    if (searchRequest.reserved_time) {
      filters.push({
        reserved_time: searchRequest.reserved_time,
      });
    }

    if (searchRequest.id_table) {
      filters.push({
        id_table: searchRequest.id_table,
      });
    }

    if (searchRequest.username) {
      filters.push({
        username: searchRequest.username,
      });
    }

    if (searchRequest.email) {
      filters.push({
        email: searchRequest.email,
      });
    }

    if (searchRequest.status) {
      filters.push({
        status: searchRequest.status,
      });
    }

    if (!filters.length) {
      filters.push({
        status: 1,
      });
    }

    const reservations = await this.prismaService.reservation.findMany({
      where: {
        AND: filters,
      },
    });

    return {
      data: reservations.map((reservation) =>
        this.toReservationResponse(reservation),
      ),
    };
  }

  async updateReservation(reservationId: number): Promise<ReservationResponse> {
    const reservation = await this.prismaService.reservation.update({
      where: {
        receipt: reservationId,
      },
      data: {
        status: 3,
      },
    });

    await this.prismaService.table.update({
      where: {
        id: reservation.id_table,
      },
      data: {
        status: 1,
      },
    });

    return {
      receipt: reservation.receipt,
      reserved_time: reservation.reserved_time,
      id_table: reservation.id_table,
      status: reservation.status,
      username: reservation.username,
      email: reservation.email,
    };
  }

  toReservationResponse(reservation: Reservation): ReservationResponse {
    return {
      receipt: reservation.receipt,
      reserved_time: reservation.reserved_time,
      id_table: reservation.id_table,
      status: reservation.status,
      username: reservation.username,
      email: reservation.email,
    };
  }

  async checkTableAvailability(tableId: number, reserved_time: string) {
    let tableIsOpen = false;
    const now = new Date();
    const nowDateTime = now.toISOString();
    const nowDate = nowDateTime.split('T')[0];

    const table = await this.prismaService.table.findFirst({
      where: {
        id: tableId,
        status: 1,
      },
    });

    if (!table) {
      throw new HttpException('Table is not ready', 404);
    }

    const open_hr = table.open_hr;
    const closed_hr = table.closed_hr;
    const reserved_hr = reserved_time;

    const OpenTime = new Date(nowDate + 'T' + open_hr);
    const ClosedTime = new Date(nowDate + 'T' + closed_hr);
    const ReservedTime = new Date(nowDate + 'T' + reserved_hr);

    if (ReservedTime >= OpenTime && ReservedTime <= ClosedTime) {
      tableIsOpen = true;
    } else {
      tableIsOpen = false;
      throw new HttpException('Table is not ready', 404);
    }

    return tableIsOpen;
  }
}
