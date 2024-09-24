import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TableService } from './table.service';
import { WebResponse } from '../../model/web.model';
import {
  CreateTableRequest,
  TableResponse,
  TableRequest,
} from '../../model/table.model';
import { Auth } from '../../common/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/tables')
export class TableController {
  constructor(private tableService: TableService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Body() request: CreateTableRequest,
  ): Promise<WebResponse<TableResponse>> {
    const result = await this.tableService.create(request);
    return {
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  async search(
    @Auth() user: User,
    @Query('name') name?: string,
    @Query('status', ParseIntPipe) status?: number,
  ): Promise<WebResponse<TableResponse[]>> {
    const request: TableRequest = {
      name: name,
      status: status,
    };

    return this.tableService.SearchTable(request);
  }

  @Patch('/:tableId')
  @HttpCode(200)
  async updateUser(
    @Auth() user: User,
    @Param('tableId', ParseIntPipe) tableId: number,
    @Body() request: TableRequest,
  ): Promise<WebResponse<TableResponse>> {
    const result = await this.tableService.updateTable(tableId, request);
    return {
      data: result,
    };
  }

  @Delete('/:tableId')
  @HttpCode(200)
  async remove(
    @Auth() user: User,
    @Param('tableId', ParseIntPipe) tableId: number,
  ): Promise<WebResponse<boolean>> {
    await this.tableService.remove(tableId);
    return {
      data: true,
    };
  }
}
