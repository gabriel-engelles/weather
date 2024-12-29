import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWeather, ProcessedForecast } from "@/services/useWeather";

import { WeatherCard } from "@/components/CardWeather";
import { SearchBar } from "@/components/SearchBar";
import { HourlyForecast } from "@/components/HourlyForecast";
import { WeeklyForecast } from "@/components/WeeklyForecast";
import { IndexCard } from "@/components/IndexCard";

export default function ScreenIndex() {
  const apiForecast = useWeather();
  const [cityName, setCityName] = useState<string | null>("--");
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [forecastData, setForecastData] = useState<ProcessedForecast | null>();
  const [uvIndexData, setUvIndexData] = useState();
  const [uvDescriptionData, setUvDescriptionData] = useState();

  
  const grouped = forecastData?.grouped || {};
  const firstDateKey = Object.keys(grouped)?.[0];
  const firstDayForecasts = grouped[firstDateKey]?.forecasts || [];
  const sunset = forecastData?.original.city.sunset || 0;
  const sunrise = forecastData?.original.city.sunrise || 0;
  const city = forecastData?.original.city.name || "-";
  const temperature = Number(grouped[firstDateKey]?.averages.avgTemp.toFixed(0)) || 0;
  const maxTemp = Number(grouped[firstDateKey]?.averages.maxTemp.toFixed(0)) || 0;
  const minTemp = Number(grouped[firstDateKey]?.averages.minTemp.toFixed(0)) || 0;
  const description = grouped[firstDateKey]?.forecasts[0]?.data.weather[0]?.description || "--";
  const uvIndex = Number(uvIndexData).toFixed(0);
  const uvDescription = uvDescriptionData;
  const sunsetTime = formatUnixTimestampToTime(sunset);
  const sunriseTime = formatUnixTimestampToTime(sunrise);
  const precipitation = forecastData?.original.list[0].pop || 0;
  const feelsLike = forecastData?.original.list[0].main.feels_like || 0;
  const humidity = forecastData?.original.list[0].main.humidity || 0;
  const windy = Number(forecastData?.original.list[0].wind.speed) * 3.6 || 0;
  const deg = getWindDirection(Number(forecastData?.original.list[0].wind.deg)) || 0;
  const data = [{ key: "1" }];

  const loadLocationFromStorage = async () => {
    try {
      const storedLat = await AsyncStorage.getItem("latitude");
      const storedLon = await AsyncStorage.getItem("longitude");
      if (storedLat && storedLon) {
        setLat(parseFloat(storedLat));
        setLon(parseFloat(storedLon));
      }
    } catch (error) {
      console.error("Erro ao carregar a localização armazenada:", error);
    }
  };

  const saveLocationToStorage = async (latitude: number, longitude: number) => {
    try {
      await AsyncStorage.setItem("latitude", latitude.toString());
      await AsyncStorage.setItem("longitude", longitude.toString());
    } catch (error) {
      console.error("Erro ao salvar a localização:", error);
    }
  };

  const handleLocationUpdate = async (latitude?: number, longitude?: number, city?: string) => {
    if (latitude != null && longitude != null) {
      if (latitude !== lat || longitude !== lon) {
        setCityName(city || cityName);
        setLat(latitude);
        setLon(longitude);
        saveLocationToStorage(latitude, longitude);
      }
    } else {
      try {
        const storedLat = await AsyncStorage.getItem("latitude");
        const storedLon = await AsyncStorage.getItem("longitude");
        if (storedLat && storedLon) {
          const parsedLat = parseFloat(storedLat);
          const parsedLon = parseFloat(storedLon);
          setLat(parsedLat);
          setLon(parsedLon);
        }
      } catch (error) {
        console.error("Erro ao usar localização armazenada:", error);
      }
    }
  };

  const handleOnSearchStatus = (searching: boolean) => {
    setIsSearching(searching);
  };

  async function ForecastDay() {
    if (lat !== null && lon !== null) {
      try {
        const response = await apiForecast.forecastResponse(lat, lon);
        const uvi = await apiForecast.UVResponse(lat, lon);
        setUvIndexData(uvi?.uvValue);
        setUvDescriptionData(uvi?.uvClassification as any);
        setForecastData(response);
      } catch (error) {
        console.error("Erro ao buscar localização:", error);
      }
    }
  }

  const weeklyData = Object.entries(grouped).map(([date, data]) => ({
    day: date,
    minTemp: data.averages.minTemp,
    maxTemp: data.averages.maxTemp,
    icon: `http://openweathermap.org/img/wn/${data.forecasts[0]?.data?.weather?.[0]?.icon}@2x.png`,
  }));

  const hourlyData = firstDayForecasts.map((forecast) => ({
    time: forecast.time,
    temperature: forecast.data.main.temp,
    icon: `http://openweathermap.org/img/wn/${forecast.data.weather[0].icon}@2x.png`,
  }));

  function formatUnixTimestampToTime(timestamp: any) {
    if (!timestamp) return "--:--";
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  function getWindDirection(deg: number): string {
    if ((deg >= 0 && deg <= 22.5) || (deg > 337.5 && deg <= 360)) {
      return "Norte";
    } else if (deg > 22.5 && deg <= 67.5) {
      return "Nordeste";
    } else if (deg > 67.5 && deg <= 112.5) {
      return "Leste";
    } else if (deg > 112.5 && deg <= 157.5) {
      return "Sudeste";
    } else if (deg > 157.5 && deg <= 202.5) {
      return "Sul";
    } else if (deg > 202.5 && deg <= 247.5) {
      return "Sudoeste";
    } else if (deg > 247.5 && deg <= 292.5) {
      return "Oeste";
    } else if (deg > 292.5 && deg <= 337.5) {
      return "Noroeste";
    } else {
      return "Direção inválida";
    }
  }

  useEffect(() => {
    loadLocationFromStorage();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    ForecastDay();
    interval = setInterval(() => {
      ForecastDay();
    }, 300000);
    return () => clearInterval(interval);
  }, [lat, lon]);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.key}
      renderItem={null}
      ListHeaderComponent={
        <>
          <SearchBar onLocationUpdate={handleLocationUpdate} onSearchStatus={handleOnSearchStatus} />
          {!isSearching ? (
            <>
              <WeatherCard
                city={city}
                temperature={temperature}
                maxTemp={maxTemp}
                minTemp={minTemp}
                description={description}
                image={
                  `http://openweathermap.org/img/wn/${grouped[firstDateKey]?.forecasts[0]?.data.weather[0]?.icon}@2x.png` || ""
                }
              />
              <HourlyForecast data={hourlyData} />
              <WeeklyForecast weeklyData={weeklyData} />
            </>
          ) : null}
        </>
      }
      ListFooterComponent={
        !isSearching ? (
          <View style={styles.cards}>
            <IndexCard image="brightness-high-fill" title="INDÍCE UV" text={uvIndex} description={uvDescription} />
            <IndexCard
              image="brightness-alt-high-fill"
              title="POR DO SOL"
              text={sunsetTime}
              description={`Nascer do sol: ${sunriseTime}`}
            />
            <IndexCard image="windy" title="VENTO" text={windy.toFixed(0)} subText="km/h" description={deg} />
            <IndexCard image="droplet-fill" title="PRECIPITAÇÃO" text={precipitation} subText="mm" description="Nas últimas 24h" />
            <IndexCard image="thermometer-half" title="SENSAÇÃO" text={feelsLike.toFixed(0)} subText="º" />
            <IndexCard image="windy-fill" title="UMIDADE" text={humidity} subText="%" />
          </View>
        ) : null
      }
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6EC5E9",
  },
  scrollContent: {
    padding: 16,
  },
  list: {
    marginTop: 20,
    width: "100%",
  },
  cards: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
});
