import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Home", 
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="map" 
        options={{ 
          title: "Map", 
          tabBarIcon: ({ color }) => <Ionicons name="map" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="weather" 
        options={{ 
          title: "Weather", 
          tabBarIcon: ({ color }) => <Ionicons name="cloud" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="empty1" 
        options={{ 
          title: "Empty 1", 
          tabBarIcon: ({ color }) => <Ionicons name="ellipse-outline" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="empty2" 
        options={{ 
          title: "Empty 2", 
          tabBarIcon: ({ color }) => <Ionicons name="ellipse-outline" size={24} color={color} />
        }} 
      />
    </Tabs>
  );
}
