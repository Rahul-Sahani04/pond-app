import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { ImageProvider } from './src/contexts/ImageContext';

// for using tailwind css
import "./global.css"

const App = () => {
  return (
    <AuthProvider>
      <ImageProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </ImageProvider>
    </AuthProvider>
  );
};

export default App;
