import { Controller, Get, Query } from '@nestjs/common';
import { CarbonService } from './carbon.service';

@Controller('carbon')
export class CarbonController {

    constructor(private carbonService: CarbonService) {}

    @Get('coords')
    async getCoords(@Query('city') city: string) {
        return this.carbonService.getCoordinates(city);
    }
}
