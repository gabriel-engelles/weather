import React from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";

interface DayForecast {
  day: string;
  minTemp: number;
  maxTemp: number;
  icon: string;
}

interface WeeklyForecastProps {
  weeklyData: DayForecast[];
}

export function WeeklyForecast({ weeklyData }: WeeklyForecastProps) {
  const getDayLabel = (day: string): string => {
    const today = new Date();
    const forecastDate = new Date(day);
    if (
      forecastDate.getDate() === today.getDate() &&
      forecastDate.getMonth() === today.getMonth() &&
      forecastDate.getFullYear() === today.getFullYear()
    ) {
      return "Hoje";
    }
    const daysOfWeek = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    return daysOfWeek[forecastDate.getDay()];
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={require("@/assets/images/icon/calendar2-week.png")}></Image>
        <Text style={styles.title}>PREVISÃO PRÓXIMOS DIAS</Text>
      </View>
      <FlatList
        data={weeklyData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.day}>{getDayLabel(item.day)}</Text>
            <Image
              source={{ uri: item.icon }}
              style={styles.icon}
              accessibilityLabel={`Ícone da condição: ${item.icon}`}
            />
            <View style={styles.tempContainer}>
              <View style={styles.minMax}>
                <Text style={styles.tempTitle}>min</Text>
                <Text style={styles.temp}>{item.minTemp.toFixed(0)}°</Text>
              </View>
              <Text style={styles.tempTitle}>max</Text>
              <Text style={styles.temp}>{item.maxTemp.toFixed(0)}°</Text>
            </View>
          </View>
        )}
      />
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
  titleContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    paddingBottom: 5,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  title: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "bold",
  },
  tempTitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderStyle: "dashed",
    paddingBottom: 5,
  },
  day: {
    fontSize: 16,
    color: "#fff",
    flex: 1,
  },
  tempContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    width: 100,
  },
  temp: {
    fontSize: 14,
    color: "#fff",
  },
  minMax: {
    flexDirection: "row",
    gap: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
});
