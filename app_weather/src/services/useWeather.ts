import axios from 'axios';
import { API_KEY } from '@/utils/WeatherAPIKey';

export interface Forecast {
  cod: number;
  message: string;
  cnt: number;
  list: ForecastData[];
  city: CityLocation[];
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
  weather: [{
    id: number;
    main: string;
    description: string;
    icon: string;
  }]
  clouds: {all: number};
  wind: {speed: number; deg: number; gust: number;};
  visibility: number;
  pop: number;
  sys: {pod: string};
  dt_txt: string;
  uvi: string;
}

interface CityLocation {
  id: number;
  name: string;
  coord: {lat: number; lon: number};
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
  async function geoResponse(city: string): Promise<GeoData> {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city},&limit=5&appid=${API_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar informações geográficas:", error);
      throw error;
    }
  }

  async function forecastResponse(lat: number, lon: number): Promise<ProcessedForecast> {
    try {
      const response = await axios.get<ApiResponse>(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
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
      const [date] = item.dt_txt.split(" ");

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

      grouped[date].forecasts.push({
        time: item.dt_txt.split(" ")[1],
        data: item,
      });
    });

    for (const [date, group] of Object.entries(grouped)) {
      const temperatures = group.forecasts.map(f => f.data.main.temp);
      const minTemp = Math.min(...temperatures);
      const maxTemp = Math.max(...temperatures);
      const avgTemp = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;

      group.averages = {
        minTemp,
        maxTemp,
        avgTemp,
      };
    }

    return grouped;
  }

  async function UVResponse(lat: number, lon: number) {
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`
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
    }
  }
  
  return { geoResponse, forecastResponse, UVResponse };
}