import { Module } from '@nestjs/common';
import { CarbonService } from './carbon.service';
import { CarbonController } from './carbon.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CarbonService],
  controllers: [CarbonController],
  exports: [CarbonService]
})
export class CarbonModule {}
