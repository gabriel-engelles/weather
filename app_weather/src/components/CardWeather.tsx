import React from 'react';
import { View, Text, StyleSheet, PressableProps, Image } from 'react-native';

type Props = PressableProps & {
  city: string;
  temperature?: number;
  maxTemp: number;
  minTemp: number;
  description: string;
  image: any;
}

export function WeatherCard({city, temperature, maxTemp, minTemp, description, image}: Props){
  return (
    <View style={styles.card}>
      <Text style={styles.city}>{city}</Text>
      <View style={styles.temperatureContainer}>
      {image ? <Image source={{ uri: image }} style={styles.icon} /> : null}
        <Text style={styles.temperature}>{temperature}°</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.minMax}>
        <View style={styles.minMaxRow}>
          <Text style={styles.mText}>Máx.: </Text>
          <Text style={styles.mTemp}>{maxTemp}°</Text>
        </View>
        <View style={styles.minMaxRow}>
          <Text style={styles.mText}>Min.:</Text>
          <Text style={styles.mTemp}>{minTemp}°</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  city: {
    fontSize: 34,
    color: '#fff',
    fontWeight: 'bold',
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 150,
    height: 150
  },
  temperature: {
    fontSize: 96,
    color: '#fff',
    fontWeight: '300',
  },
  description: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  minMax: {
    flexDirection: 'row',
    gap: 10,
  },
  minMaxRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  mText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  mTemp: {
    fontSize: 17,
    color: '#FFF',
    fontWeight: '500',
  }
});
