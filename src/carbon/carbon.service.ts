import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CarbonService {

    constructor(private httpsService: HttpService,
                private configService: ConfigService
    ) {}
    

    async getCoordinates(city: string) {
        try{
            const apiKey = this.configService.get<string>('GEOMAPS_API_KEY');

            if (!apiKey) {
                throw new Error('GEOMAPS_API_KEY is missing from .env');
            }

            const response = await firstValueFrom(
                this.httpsService.get(`https://geocode.maps.co/search?q=${city}&api_key=${apiKey}`)
            )

            if (!response.data || response.data.length === 0) {
            throw new Error(`City "${city}" not found`);
            }

            const location = response.data[0]

            return {
                city: location.display_name,
                latitude: location.lat,
                longitude: location.lon
            }
        } catch (error) {
            console.error('Error fetching city data:', error.message)
        }

    }

}
