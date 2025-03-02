import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

const API_KEY = '8a3e2915b7d4452793760517250203'; // Replace with your WeatherAPI.com key

type LocationType = {
  latitude: number;
  longitude: number;
};

export default function WeatherScreen() {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeather(location.latitude, location.longitude);
    }
  }, [location]);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      console.log(`Fetching weather for: ${lat}, ${lon}`);
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`
      );
      const data = await response.json();
      console.log('Weather API Response:', data);

      if (data.error) {
        setError(`Error: ${data.error.message}`);
        return;
      }

      setWeather(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : weather ? (
        <View>
          <Text style={styles.city}>{weather.location?.name}, {weather.location?.country}</Text>
          <Text style={styles.temp}>{weather.current?.temp_c}°C</Text>
          <Text style={styles.desc}>{weather.current?.condition?.text}</Text>
        </View>
      ) : (
        <Text>No weather data available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  city: { fontSize: 24, fontWeight: 'bold' },
  temp: { fontSize: 40, fontWeight: 'bold', marginVertical: 10 },
  desc: { fontSize: 18, fontStyle: 'italic' },
  error: { fontSize: 18, color: 'red', fontWeight: 'bold' },
});
