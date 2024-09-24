import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  CreateTableRequest,
  TableResponse,
  TableRequest,
} from '../../model/table.model';
import { WebResponse } from '../../model/web.model';
import { ValidationService } from '../../common/validation.service';
import { TableValidation } from './table.validation';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../../common/prisma.service';
import { Table } from '@prisma/client';

@Injectable()
export class TableService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async create(request: CreateTableRequest): Promise<TableResponse> {
    this.logger.debug(`Create new Table ${JSON.stringify(request)}`);

    const createRequest: CreateTableRequest = this.validationService.validate(
      TableValidation.CREATE,
      request,
    );

    const totalTableWithSameName = await this.prismaService.table.count({
      where: {
        name: createRequest.name,
      },
    });

    if (totalTableWithSameName != 0) {
      throw new HttpException('Table already exists', 400);
    }

    const table = await this.prismaService.table.create({
      data: createRequest,
    });

    return {
      id: table.id,
      name: table.name,
      status: table.status,
      open_hr: table.open_hr,
      closed_hr: table.closed_hr,
    };
  }

  toTableResponse(table: Table): TableResponse {
    return {
      id: table.id,
      name: table.name,
      status: table.status,
      open_hr: table.open_hr,
      closed_hr: table.closed_hr,
    };
  }

  async SearchTable(
    request: TableRequest,
  ): Promise<WebResponse<TableResponse[]>> {
    const filters = [];

    const searchRequest: TableRequest = this.validationService.validate(
      TableValidation.SEARCH,
      request,
    );

    if (searchRequest.name) {
      filters.push({
        name: searchRequest.name,
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

    const tables = await this.prismaService.table.findMany({
      where: {
        AND: filters,
      },
    });

    return {
      data: tables.map((table) => this.toTableResponse(table)),
    };
  }

  async updateTable(
    tableId: number,
    request: TableRequest,
  ): Promise<TableResponse> {
    const table = await this.checkTableIsExists(tableId);

    this.logger.debug(
      `TableService.updateTable( ${JSON.stringify(table)} , ${JSON.stringify(request)} )`,
    );

    const tableRequest: TableRequest = this.validationService.validate(
      TableValidation.UPDATE,
      request,
    );

    if (tableRequest.name) {
      table.name = tableRequest.name;
    }

    if (tableRequest.status) {
      table.status = tableRequest.status;
    }

    if (tableRequest.open_hr) {
      table.open_hr = tableRequest.open_hr;
    }

    if (tableRequest.closed_hr) {
      table.closed_hr = tableRequest.closed_hr;
    }

    const result = await this.prismaService.table.update({
      where: {
        id: tableId,
      },
      data: table,
    });

    return {
      id: result.id,
      name: result.name,
      status: result.status,
      open_hr: result.open_hr,
      closed_hr: result.closed_hr,
    };
  }

  async remove(tableId: number): Promise<TableResponse> {
    await this.checkTableIsExists(tableId);

    const table = await this.prismaService.table.delete({
      where: {
        id: tableId,
      },
    });

    return this.toTableResponse(table);
  }

  async checkTableIsExists(tableId: number): Promise<Table> {
    const table = await this.prismaService.table.findFirst({
      where: {
        id: tableId,
      },
    });

    if (!table) {
      throw new HttpException('Table is not exist', 404);
    }

    return table;
  }
}
