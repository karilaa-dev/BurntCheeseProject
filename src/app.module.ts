import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarbonModule } from './carbon/carbon.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true,}),
    CarbonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
