import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

// List of additional cities with coordinates
const additionalCities = [
  { name: 'New York', latitude: 40.7128, longitude: -74.0060 },
  { name: 'Los Angeles', latitude: 34.0522, longitude: -118.2437 },
  { name: 'Chicago', latitude: 41.8781, longitude: -87.6298 },
  { name: 'Houston', latitude: 29.7604, longitude: -95.3698 },
  { name: 'Phoenix', latitude: 33.4484, longitude: -112.0740 },
  { name: 'Philadelphia', latitude: 39.9526, longitude: -75.1652 },
  { name: 'San Antonio', latitude: 29.4241, longitude: -98.4936 },
  { name: 'San Diego', latitude: 32.7157, longitude: -117.1611 },
  { name: 'Dallas', latitude: 32.7767, longitude: -96.7970 },
  { name: 'San Jose', latitude: 37.3382, longitude: -121.8863 },
];

export default function Index() {
  const router = useRouter(); // ✅ correct router hook

  const [cityWeatherList, setCityWeatherList] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch weather for a city
  const fetchWeather = async (
    latitude: number,
    longitude: number,
    cityName: string,
    isUserLocation: boolean = false
  ) => {
    const apiKey = 'f7174a8bd4597246158689511f1bd81d';
    const url =
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}` +
      `&lon=${longitude}&appid=${apiKey}&units=imperial`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        const cityWeather = {
          name: cityName,
          temp: `${data.main.temp}°F`,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          humidity: `${data.main.humidity}%`,
          windSpeed: `${data.wind.speed} MPH`,
        };

        setCityWeatherList(prevList =>
          isUserLocation
            ? [cityWeather, ...prevList] // user location on top
            : [...prevList, cityWeather]
        );
      } else {
        alert('Failed to fetch weather data.');
      }
    } catch (error) {
      alert('Error fetching weather data.');
    }
  };

  // Get user location and fetch all weather
  useEffect(() => {
    const getLocationAndFetchWeather = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get user location
      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      // Fetch user's location weather
      fetchWeather(latitude, longitude, 'Your Location', true);
    };

    // Fetch user's location first
    getLocationAndFetchWeather();

    // Then fetch additional cities
    additionalCities.forEach(city => {
      fetchWeather(city.latitude, city.longitude, city.name, false);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Weather in Your Location and Other Cities:
      </Text>

      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : (
        <FlatList
          data={cityWeatherList}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {router.push({pathname: '/citydetail',params: { cityData: JSON.stringify(item) },} as any);
              }}
            >
              <View style={styles.listItem}>
                <Text style={styles.cityName}>{item.name}</Text>
                <Text style={styles.tempText}>Temperature: {item.temp}</Text>
                <Text style={styles.descriptionText}>
                  Conditions: {item.description}
                </Text>
                <Image
                  style={styles.icon}
                  source={{
                    uri: `https://openweathermap.org/img/wn/${item.icon}@2x.png`,
                  }}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    marginTop: 20,
    color: 'red',
  },
  listItem: {
    padding: 12,
    marginVertical: 6,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    width: 280,
    elevation: 2,
  },
  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tempText: {
    fontSize: 16,
  },
  descriptionText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  icon: {
    width: 50,
    height: 50,
    marginTop: 4,
  },
});
