import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function CityDetail() {
  const { cityData } = useLocalSearchParams<{ cityData?: string }>();

  if (!cityData) {
    return (
      <View style={styles.detailContainer}>
        <Text>No city data available</Text>
      </View>
    );
  }

  const parsedCityData = JSON.parse(cityData);

  return (
    <View style={styles.detailContainer}>
      <Text style={styles.cityName}>{parsedCityData.name}</Text>
      <Image
        style={styles.icon}
        source={{
          uri: `https://openweathermap.org/img/wn/${parsedCityData.icon}@2x.png`,
        }}
      />
      <Text style={styles.infoText}>Temperature: {parsedCityData.temp}</Text>
      <Text style={styles.infoText}>Conditions: {parsedCityData.description}</Text>
      <Text style={styles.infoText}>Humidity: {parsedCityData.humidity}</Text>
      <Text style={styles.infoText}>Wind: {parsedCityData.windSpeed}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  detailContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  cityName: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 18,
    marginVertical: 4,
  },
});
