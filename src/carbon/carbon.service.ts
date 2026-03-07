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
            if (error instanceof Error) {
            console.error('Error fetching city data:', error.message);
        }
        throw error;
        }
    }


    async getAvgCarbonIntensity(lat: string, lon: string) {

        try{
            const apiKey = this.configService.get<string>('ELECTRICITYMAPS_API_KEY')

            if (!apiKey) {
                throw new Error('ELECTRICITYMAPS_API_KEY is missing from .env');
            }

            const url = `https://api.electricitymaps.com/v3/carbon-intensity/forecast?lat=${lat}&lon=${lon}`

            const response = await firstValueFrom(
                this.httpsService.get(url, {
                    headers: {
                        'auth-token': apiKey,
                    }
                })
            )

            // Calculate the avg carbon intensity
            const forecastData = response.data.forecast;

            const carbonIntensity = forecastData.map(item => item.carbonIntensity);

            let total = 0;

            for (const item of carbonIntensity) {
                total += item;
            }

            const avg = total/carbonIntensity.length

            return avg;

        } catch (error) {
            if (error instanceof Error) {
                console.error('Error fetching carbon data:', error.message)
            }
            throw error;
        }
    }

    async getCarbonData(city: string) {

        const location = await this.getCoordinates(city)

        const carbon = await this.getAvgCarbonIntensity(location.latitude, location.longitude)

        return {
            city, 
            latitude: location.latitude,
            longitude: location.longitude,
            carbonIntensity: carbon
        }
    }

}
