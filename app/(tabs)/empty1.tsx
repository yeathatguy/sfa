import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

export default function RouteTrackingScreen() {
  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [fuel, setFuel] = useState('');
  const [mileage, setMileage] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is required to track movement.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setRoute(prevRoute => [...prevRoute, currentLocation.coords]);
    })();

    const locationSubscription = Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
      (newLocation) => {
        setLocation(newLocation.coords);
        setRoute(prevRoute => [...prevRoute, newLocation.coords]);
        checkFuelWarning();
      }
    );
    return () => locationSubscription.then(sub => sub.remove());
  }, []);

  const checkFuelWarning = () => {
    const fuelAmount = parseFloat(fuel);
    const mileageValue = parseFloat(mileage);
    if (!isNaN(fuelAmount) && !isNaN(mileageValue) && route.length > 1) {
      const estimatedDistance = (fuelAmount * mileageValue);
      if (route.length * 0.01 > estimatedDistance * 0.9) {
        Alert.alert('Fuel Warning', 'You are about to run out of diesel soon!');
      }
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={location ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      } : undefined}>
        {location && <Marker coordinate={location} title="Your Location" />}
        <Polyline coordinates={route} strokeWidth={4} strokeColor="blue" />
      </MapView>
      <View style={styles.inputContainer}>
        <Text>Estimated Fuel (liters):</Text>
        <TextInput style={styles.input} keyboardType='numeric' value={fuel} onChangeText={setFuel} />
        <Text>Mileage (km per liter):</Text>
        <TextInput style={styles.input} keyboardType='numeric' value={mileage} onChangeText={setMileage} />
        <Button title="Check Fuel Status" onPress={checkFuelWarning} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  inputContainer: { padding: 10, backgroundColor: 'white' },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 5 },
});