import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './module/user/user.module';
import { TableModule } from './module/table/table.module';
import { ReservationModule } from './module/reservation/reservation.module';
import { EmailModule } from './module/mail/mail.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    TableModule,
    ReservationModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
