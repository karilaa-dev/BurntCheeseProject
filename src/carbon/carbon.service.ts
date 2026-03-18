import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

interface GeocodeResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface CarbonForecastResponse {
  forecast: Array<{ carbonIntensity: number }>;
}

interface CarbonIntensityLatest {
  carbonIntensity: number;
}

interface ValueLatest {
  value: number;
}

interface ElectricityMixLatest {
  data?: Array<{ mix?: object }>;
}

@Injectable()
export class CarbonService {
  constructor(
    private httpsService: HttpService,
    private configService: ConfigService,
  ) {}

  async getCoordinates(
    city: string,
  ): Promise<{ city: string; latitude: string; longitude: string }> {
    try {
      const apiKey = this.configService.get<string>('GEOMAPS_API_KEY');

      if (!apiKey) {
        throw new Error('GEOMAPS_API_KEY is missing from .env');
      }

      const response = await firstValueFrom(
        this.httpsService.get<GeocodeResult[]>(
          `https://geocode.maps.co/search?q=${city}&api_key=${apiKey}`,
        ),
      );

      if (!response.data || response.data.length === 0) {
        throw new Error(`City "${city}" not found`);
      }

      const location = response.data[0];

      return {
        city: location.display_name,
        latitude: location.lat,
        longitude: location.lon,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching city data:', error.message);
      }
      throw error;
    }
  }

  async getAvgCarbonIntensity(lat: string, lon: string) {
    try {
      const apiKey = this.configService.get<string>('ELECTRICITYMAPS_API_KEY');

      if (!apiKey) {
        throw new Error('ELECTRICITYMAPS_API_KEY is missing from .env');
      }

      const url = `https://api.electricitymaps.com/v3/carbon-intensity/forecast?lat=${lat}&lon=${lon}`;

      const response = await firstValueFrom(
        this.httpsService.get<CarbonForecastResponse>(url, {
          headers: {
            'auth-token': apiKey,
          },
        }),
      );

      // Calculate the avg carbon intensity
      const forecastData = response.data.forecast;

      const carbonIntensity = forecastData.map((item) => item.carbonIntensity);

      let total = 0;

      for (const item of carbonIntensity) {
        total += item;
      }

      const avg = total / carbonIntensity.length;

      return avg;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching carbon data:', error.message);
      }
      throw error;
    }
  }

  async getCarbonData(city: string) {
    const location = await this.getCoordinates(city);

    const carbon = await this.getAvgCarbonIntensity(
      location.latitude,
      location.longitude,
    );

    return {
      city: location.city,
      latitude: location.latitude,
      longitude: location.longitude,
      carbonIntensity: carbon,
    };
  }

  private async fetchFromElectricityMaps<T>(
    endpoint: string,
    lat: string,
    lon: string,
  ): Promise<T> {
    const apiKey = this.configService.get<string>('ELECTRICITYMAPS_API_KEY');
    if (!apiKey)
      throw new Error('ELECTRICITYMAPS_API_KEY is missing from .env');

    const url = `https://api.electricitymaps.com/v3/${endpoint}?lat=${lat}&lon=${lon}`;
    const response = await firstValueFrom(
      this.httpsService.get<T>(url, { headers: { 'auth-token': apiKey } }),
    );
    return response.data;
  }

  async getLatestCarbonIntensity(
    lat: string,
    lon: string,
  ): Promise<number | null> {
    const data = await this.fetchFromElectricityMaps<CarbonIntensityLatest>(
      'carbon-intensity/latest',
      lat,
      lon,
    );
    return data.carbonIntensity ?? null;
  }

  async getCarbonFreeEnergy(lat: string, lon: string): Promise<number | null> {
    const data = await this.fetchFromElectricityMaps<ValueLatest>(
      'carbon-free-energy/latest',
      lat,
      lon,
    );
    return data.value ?? null;
  }

  async getRenewableEnergy(lat: string, lon: string): Promise<number | null> {
    const data = await this.fetchFromElectricityMaps<ValueLatest>(
      'renewable-energy/latest',
      lat,
      lon,
    );
    return data.value ?? null;
  }

  async getTotalLoad(lat: string, lon: string): Promise<number | null> {
    const data = await this.fetchFromElectricityMaps<ValueLatest>(
      'total-load/latest',
      lat,
      lon,
    );
    return data.value ?? null;
  }

  async getElectricityMix(lat: string, lon: string): Promise<object | null> {
    const data = await this.fetchFromElectricityMaps<ElectricityMixLatest>(
      'electricity-mix/latest',
      lat,
      lon,
    );
    return data.data?.[0]?.mix ?? null;
  }

  async getAllCityData(city: string) {
    const location = await this.getCoordinates(city);
    const lat = location.latitude;
    const lon = location.longitude;

    const unwrap = <T>(r: PromiseSettledResult<T>) =>
      r.status === 'fulfilled' ? (r.value ?? null) : null;

    const [
      carbonIntensityResult,
      carbonFreeResult,
      renewableResult,
      totalLoadResult,
      electricityMixResult,
    ] = await Promise.allSettled([
      this.getLatestCarbonIntensity(lat, lon),
      this.getCarbonFreeEnergy(lat, lon),
      this.getRenewableEnergy(lat, lon),
      this.getTotalLoad(lat, lon),
      this.getElectricityMix(lat, lon),
    ]);

    return {
      city: location.city,
      latitude: lat,
      longitude: lon,
      carbonIntensity: unwrap(carbonIntensityResult),
      carbonFreePercentage: unwrap(carbonFreeResult),
      renewablePercentage: unwrap(renewableResult),
      totalLoad: unwrap(totalLoadResult),
      powerBreakdown: unwrap(electricityMixResult),
    };
  }
}
