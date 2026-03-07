import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarbonModule } from './carbon/carbon.module';

@Module({
  imports: [CarbonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
