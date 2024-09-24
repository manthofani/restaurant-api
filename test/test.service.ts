import { PrismaService } from '../src/common/prisma.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, Table } from '@prisma/client';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteAll() {
    await this.deleteReservation();
    await this.deleteTable();
    await this.deleteUser();
  }

  async getUser(): Promise<User> {
    return this.prismaService.user.findFirst({
      where: {
        username: 'tegar',
      },
    });
  }

  async getTable(): Promise<Table> {
    return this.prismaService.table.findFirst({
      where: {
        name: 'Table 1',
      },
    });
  }

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'tegar',
      },
    });
  }

  async deleteTable() {
    await this.prismaService.table.deleteMany({
      where: {
        name: 'Table 1',
      },
    });
  }
  async deleteReservation() {
    await this.prismaService.reservation.deleteMany({
      where: {
        username: 'tegar',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'tegar',
        name: 'Tegar Manthofani',
        password: await bcrypt.hash('developer', 10),
        email: 'tegar@customer.com',
        roles: 'user',
        token: '12345',
      },
    });
  }

  async createTable() {
    await this.prismaService.table.create({
      data: {
        name: 'Table 1',
        status: 1,
        open_hr: '10:00',
        closed_hr: '23:00',
      },
    });
  }
}
