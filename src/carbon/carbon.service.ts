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
        const apiKey = this.configService.get<string>('GEOMAPS_API_KEY');

        const response = await firstValueFrom(
            this.httpsService.get(`https://geocode.maps.co/search?q=${city}&api_key=${apiKey}`)
        )

        const location = response.data[0]

        return {
            city: location.display_name,
            latitude: location.lat,
            longitude: location.lon
        }
    }

}
