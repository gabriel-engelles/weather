import axios from 'axios';
import { apiKeyWorks } from '@/utils/WeatherAPIKey';

export interface Forecast {
  cod: number;
  message: string;
  cnt: number;
  list: ForecastData[];
  city: CityLocation;
}

interface ForecastData {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_max: number;
    temp_min: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  clouds: { all: number };
  wind: { speed: number; deg: number; gust: number };
  visibility: number;
  pop: number;
  sys: { pod: string };
  dt_txt: string;
}

interface CityLocation {
  id: number;
  name: string;
  coord: { lat: number; lon: number };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface GeoData {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

interface ApiResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastData[];
  city: CityLocation;
}

interface GroupedForecast {
  [date: string]: {
    forecasts: Array<{
      time: string;
      data: ForecastData;
    }>;
    averages: {
      minTemp: number;
      maxTemp: number;
      avgTemp: number;
    };
  };
}

export interface ProcessedForecast {
  original: ApiResponse;
  grouped: GroupedForecast;
}

export function useWeather() {
  async function getApiKey(): Promise<string> {
    const secureStore = await apiKeyWorks();
    const apiKey = await secureStore.getData("API_KEY");
    if (!apiKey) {
      throw new Error("API Key não encontrada.");
    }
    return apiKey;
  }

  async function geoResponse(city: string): Promise<GeoData> {
    try {
      const apiKey = await getApiKey();
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
      );
      return response.data; // Retorna o primeiro resultado
    } catch (error) {
      console.error("Erro ao buscar informações geográficas:", error);
      throw error;
    }
  }

  async function forecastResponse(lat: number, lon: number): Promise<ProcessedForecast> {
    try {
      const apiKey = await getApiKey();
      const response = await axios.get<ApiResponse>(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const groupedData = groupForecastByDay(response.data);

      return {
        original: response.data,
        grouped: groupedData,
      };
    } catch (error) {
      console.error("Erro ao buscar informações climáticas: ", error);
      throw error;
    }
  }

  function groupForecastByDay(apiResponse: ApiResponse): GroupedForecast {
    const grouped: GroupedForecast = {};

    apiResponse.list.forEach(item => {
      const [date, time] = item.dt_txt.split(" ");

      if (!grouped[date]) {
        grouped[date] = {
          forecasts: [],
          averages: {
            minTemp: Infinity,
            maxTemp: -Infinity,
            avgTemp: 0,
          },
        };
      }

      grouped[date].forecasts.push({ time, data: item });
    });

    Object.values(grouped).forEach(group => {
      const temps = group.forecasts.map(f => f.data.main.temp);
      group.averages = {
        minTemp: Math.min(...temps),
        maxTemp: Math.max(...temps),
        avgTemp: temps.reduce((sum, temp) => sum + temp, 0) / temps.length,
      };
    });

    return grouped;
  }

  async function UVResponse(lat: number, lon: number) {
    try {
        const apiKey = await getApiKey();
        const response = await axios.get(
            `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );

        const uvValue = response.data.value;
        let uvClassification = "";

        if (uvValue >= 0 && uvValue <= 20) {
            uvClassification = "Muito Baixo";
        } else if (uvValue > 20 && uvValue <= 40) {
            uvClassification = "Baixo";
        } else if (uvValue > 40 && uvValue <= 60) {
            uvClassification = "Alto";
        } else if (uvValue > 60 && uvValue <= 80) {
            uvClassification = "Muito Alto";
        } else if (uvValue > 80 && uvValue <= 100) {
            uvClassification = "Extremo";
        } else {
            uvClassification = "Fora do intervalo";
        }

        return {
            uvValue,
            uvClassification,
        };
    } catch (error) {
        console.error("Erro ao buscar índice UV:", error);
        throw error;
    }
}


  function classifyUV(uvValue: number): string {
    if (uvValue < 3) return "Baixo";
    if (uvValue < 6) return "Moderado";
    if (uvValue < 8) return "Alto";
    if (uvValue < 11) return "Muito Alto";
    return "Extremo";
  }

  return { geoResponse, forecastResponse, UVResponse };
}
