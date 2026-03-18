# API Documentation

All endpoints are `GET` requests. Every endpoint is available under both the `/api` and `/carbon` prefixes.

## Geocoding

### `GET /api/coords?city={city}`

Returns coordinates for a city name.

**Query Parameters:**
| Parameter | Type   | Required | Description       |
|-----------|--------|----------|-------------------|
| `city`    | string | Yes      | Name of the city  |

**Response:**
```json
{
  "city": "Seattle, King County, Washington, United States",
  "latitude": "47.6038321",
  "longitude": "-122.330062"
}
```

---

## Carbon Intensity

### `GET /api/carbonIntensityData?city={city}`

Returns the average forecasted carbon intensity for a city.

**Query Parameters:**
| Parameter | Type   | Required | Description       |
|-----------|--------|----------|-------------------|
| `city`    | string | Yes      | Name of the city  |

**Response:**
```json
{
  "city": "Seattle, King County, Washington, United States",
  "latitude": "47.6038321",
  "longitude": "-122.330062",
  "carbonIntensity": 95.42
}
```

`carbonIntensity` is in gCO2eq/kWh (average of forecast values).

---

## Carbon-Free Energy

### `GET /api/carbonFreeEnergy?city={city}`

Returns the latest carbon-free energy percentage for a city.

**Query Parameters:**
| Parameter | Type   | Required | Description       |
|-----------|--------|----------|-------------------|
| `city`    | string | Yes      | Name of the city  |

**Response:**
```json
72.5
```

Value is a percentage (0-100).

---

## Renewable Energy

### `GET /api/renewableEnergy?city={city}`

Returns the latest renewable energy percentage for a city.

**Query Parameters:**
| Parameter | Type   | Required | Description       |
|-----------|--------|----------|-------------------|
| `city`    | string | Yes      | Name of the city  |

**Response:**
```json
65.3
```

Value is a percentage (0-100).

---

## Total Load

### `GET /api/totalLoad?city={city}`

Returns the latest total electricity load for a city's zone.

**Query Parameters:**
| Parameter | Type   | Required | Description       |
|-----------|--------|----------|-------------------|
| `city`    | string | Yes      | Name of the city  |

**Response:**
```json
28500
```

Value is in MW. Divide by 1000 to get GW for display.

---

## Electricity Mix

### `GET /api/electricityMix?city={city}`

Returns the power consumption breakdown by source type for a city's zone.

**Query Parameters:**
| Parameter | Type   | Required | Description       |
|-----------|--------|----------|-------------------|
| `city`    | string | Yes      | Name of the city  |

**Response:**
```json
{
  "nuclear": 500,
  "geothermal": 0,
  "biomass": 120,
  "coal": 800,
  "wind": 3500,
  "solar": 1200,
  "hydro": 15000,
  "gas": 2000,
  "oil": 0,
  "unknown": 50,
  "hydro discharge": 0,
  "battery discharge": 0
}
```

Values are in MW.

---

## All City Data (Combined)

### `GET /api/allCityData?city={city}`

Returns all metrics for a city in a single call. Uses `Promise.allSettled` internally so one failed API call does not break the entire response — failed metrics return `null`.

**Query Parameters:**
| Parameter | Type   | Required | Description       |
|-----------|--------|----------|-------------------|
| `city`    | string | Yes      | Name of the city  |

**Response:**
```json
{
  "city": "Seattle, King County, Washington, United States",
  "latitude": "47.6038321",
  "longitude": "-122.330062",
  "carbonIntensity": 95.42,
  "carbonFreePercentage": 72.5,
  "renewablePercentage": 65.3,
  "totalLoad": 28500,
  "powerBreakdown": {
    "nuclear": 500,
    "geothermal": 0,
    "biomass": 120,
    "coal": 800,
    "wind": 3500,
    "solar": 1200,
    "hydro": 15000,
    "gas": 2000,
    "oil": 0,
    "unknown": 50,
    "hydro discharge": 0,
    "battery discharge": 0
  }
}
```

Any field may be `null` if the corresponding Electricity Maps API call failed.

---

## Route Prefixes

All endpoints listed above under `/api` are also available under `/carbon`:

| `/api` route                  | `/carbon` route                  |
|-------------------------------|----------------------------------|
| `/api/coords`                 | `/carbon/coords`                 |
| `/api/carbonIntensityData`    | `/carbon/carbonIntensityData`    |
| `/api/carbonFreeEnergy`       | `/carbon/carbonFreeEnergy`       |
| `/api/renewableEnergy`        | `/carbon/renewableEnergy`        |
| `/api/totalLoad`              | `/carbon/totalLoad`              |
| `/api/electricityMix`         | `/carbon/electricityMix`         |
| `/api/allCityData`            | `/carbon/allCityData`            |
