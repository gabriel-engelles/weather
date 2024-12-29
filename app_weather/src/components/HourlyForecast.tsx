import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";

interface Props {
  time: string;
  temperature: number;
  icon: string;
}

interface HourlyForecastProps {
  data: Props[];
}

const formatTime = (time: string | undefined): string => {
  if (!time || typeof time !== "string") {
    console.warn(`Horário inválido recebido: ${time}`);
    return "--";
  }

  const [hour] = time.split(":").map(Number);

  if (isNaN(hour)) {
    console.warn(`Falha ao analisar o horário: ${time}`);
    return "--";
  }

  const isPM = hour >= 12;
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour} ${isPM ? "PM" : "AM"}`;
};

const interpolateHourlyDataUntilNextDay = (data: Props[]): Props[] => {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("Os dados fornecidos são inválidos ou vazios.");
    return [];
  }

  const validData = data.filter((item) => item && typeof item === "object" && typeof item.time === "string"); // Filtra itens inválidos

  if (validData.length === 0) {
    console.warn("Nenhum dado válido encontrado.");
    return [];
  }

  const hourlyData: Props[] = [];

  for (let i = 0; i < validData.length - 1; i++) {
    const current = validData[i];
    const next = validData[i + 1];

    if (!current || !next || !current.time || !next.time) {
      console.warn(
        `Dado inválido encontrado durante a interpolação: ${JSON.stringify(current)} ou ${JSON.stringify(next)}`
      );
      continue;
    }

    hourlyData.push({
      ...current,
      temperature: parseFloat(current.temperature.toFixed(0)),
    });

    const currentHour = parseInt(current.time.split(":")[0], 10);
    const nextHour = parseInt(next.time.split(":")[0], 10);
    const diffHours = (nextHour - currentHour + 24) % 24;

    if (diffHours > 1) {
      for (let j = 1; j < diffHours; j++) {
        const interpolatedHour = (currentHour + j) % 24;
        const interpolatedTime = `${interpolatedHour.toString().padStart(2, "0")}:00`;
        const interpolatedTemperature =
          current.temperature + ((next.temperature - current.temperature) / diffHours) * j;

        hourlyData.push({
          time: interpolatedTime,
          temperature: parseFloat(interpolatedTemperature.toFixed(0)),
          icon: current.icon,
        });
      }
    }
  }

  const last = validData[validData.length - 1];
  if (last?.time) {
    hourlyData.push({
      ...last,
      temperature: parseFloat(last.temperature.toFixed(0)),
    });
  }

  const firstHour = parseInt(hourlyData[0].time.split(":")[0], 10);
  let currentHour = (parseInt(hourlyData[hourlyData.length - 1].time.split(":")[0], 10) + 1) % 24;
  let lastTemperature = hourlyData[hourlyData.length - 1].temperature;
  const icon = hourlyData[hourlyData.length - 1].icon;

  while (currentHour !== firstHour) {
    const interpolatedTime = `${currentHour.toString().padStart(2, "0")}:00`;
    const temperatureChange = Math.random() * 2 - 1;
    lastTemperature = Math.max(-10, Math.min(50, lastTemperature + temperatureChange));

    hourlyData.push({
      time: interpolatedTime,
      temperature: parseFloat(lastTemperature.toFixed(0)),
      icon: icon,
    });

    currentHour = (currentHour + 1) % 24;
  }

  return hourlyData;
};

export function HourlyForecast({ data }: HourlyForecastProps) {
  const interpolatedData = interpolateHourlyDataUntilNextDay(data);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        {interpolatedData.map((item, index) => (
          <View
            key={index}
            style={styles.card}
            accessible
            accessibilityLabel={`Previsão para ${formatTime(item.time)}: ${item.temperature} graus e condição ${item.icon}`}
          >
            <Text style={styles.time}>{formatTime(item.time)}</Text>
            <Image
              source={{ uri: item.icon }}
              style={styles.icon}
              accessibilityLabel={`Ícone da condição: ${item.icon}`}
            />
            <Text style={styles.temperature}>{item.temperature}°</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(246, 246, 246, 0.2)",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  scrollViewContent: {
    flexDirection: "row",
  },
  card: {
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 1,
    width: 65,
    height: 100,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  time: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
  temperature: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  icon: {
    width: 40,
    height: 40,
  },
});
