import { Controller, Get, Query } from '@nestjs/common';
import { CarbonService } from './carbon.service';

@Controller('carbon')
export class CarbonController {

    constructor(private carbonService: CarbonService) {}

    @Get('coords')
    async getCoords(@Query('city') city: string) {
        return this.carbonService.getCoordinates(city);
    }

    @Get('carbonIntensityData')
    async getCarbonIntensityData(@Query('city') city: string) {
        return this.carbonService.getCarbonData(city);
    }

    @Get('carbonFreeEnergy')
    async getCarbonFreeEnergy(@Query('city') city: string) {
        const location = await this.carbonService.getCoordinates(city);
        return this.carbonService.getCarbonFreeEnergy(location.latitude, location.longitude);
    }

    @Get('renewableEnergy')
    async getRenewableEnergy(@Query('city') city: string) {
        const location = await this.carbonService.getCoordinates(city);
        return this.carbonService.getRenewableEnergy(location.latitude, location.longitude);
    }

    @Get('totalLoad')
    async getTotalLoad(@Query('city') city: string) {
        const location = await this.carbonService.getCoordinates(city);
        return this.carbonService.getTotalLoad(location.latitude, location.longitude);
    }

    @Get('electricityMix')
    async getElectricityMix(@Query('city') city: string) {
        const location = await this.carbonService.getCoordinates(city);
        return this.carbonService.getElectricityMix(location.latitude, location.longitude);
    }

    @Get('allCityData')
    async getAllCityData(@Query('city') city: string) {
        return this.carbonService.getAllCityData(city);
    }
}
