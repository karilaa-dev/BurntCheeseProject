import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CarbonService } from './carbon/carbon.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly carbonService: CarbonService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('coords')
  async getCoords(@Query('city') city: string) {
      return this.carbonService.getCoordinates(city);
  }

  @Get('carbonIntensityData')
  async getCarbonIntensityData(@Query('city') city: string) {
      return this.carbonService.getCarbonData(city);
  }
}
