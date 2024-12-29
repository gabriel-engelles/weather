interface WeatherStyle {
  day: any;
  night: any;
  backgroundColor: string;
}

export const weatherStyles: { [key: string]: WeatherStyle } = {
  Clear: {
    day: require('@/assets/images/weatherItem/clear-day.png'),
    night: require('@/assets/images/weatherItem/clear-night.png'),
    backgroundColor: '#B0C4DE'
  },
  Clouds: {
    day: require('@/assets/images/weatherItem/cloudy.png'),
    night: require('@/assets/images/weatherItem/cloudy.png'),
    backgroundColor: '#B0C4DE'
  },
  Rain: {
    day: require('@/assets/images/weatherItem/heavy-showers.png'),
    night: require('@/assets/images/weatherItem/heavy-showers.png'),
    backgroundColor: '#B0C4DE'
  },
  Thunderstorm: {
    day: require('@/assets/images/weatherItem/thunderstorm-showers.png'),
    night: require('@/assets/images/weatherItem/thunderstorm-showers.png'),
    backgroundColor: '#B0C4DE'
  },
  Snow: {
    day: require('@/assets/images/weatherItem/snow.png'),
    night: require('@/assets/images/weatherItem/snow.png'),
    backgroundColor: '#B0C4DE'
  },
  Mist: {
    day: require('@/assets/images/weatherItem/fog.png'),
    night: require('@/assets/images/weatherItem/fog.png'),
    backgroundColor: '#B0C4DE'
  },
  // Default: {
  //   day: require('./assets/weather/defaultDay.png'),
  //   night: require('./assets/weather/defaultNight.png'),
  //   backgroundColor: '#B0C4DE'
  // },
};
