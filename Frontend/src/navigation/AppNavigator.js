import React, { useEffect } from 'react';
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import RevisitScreen from '../screens/RevisitScreen';
import SearchScreen from '../screens/SearchScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import darkTheme from '../themes/darkTheme';
import { useImages } from '../contexts/ImageContext';
import { useAuth } from '../contexts/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabIcon = ({ focused, icon, label, disabled }) => (
  <View style={{ 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 100,
    opacity: disabled ? 0.5 : 1
  }}>
    <Ionicons 
      name={icon} 
      size={24} 
      color={focused ? '#fff' : 'rgba(255, 255, 255, 0.5)'} 
    />
    <Text style={{
      marginTop: 4,
      fontSize: 12,
      color: focused ? '#fff' : 'rgba(255, 255, 255, 0.5)',
    }}>
      {label}
    </Text>
  </View>
);

const TabNavigator = ({ hasImages, setHasImages }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopWidth: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          elevation: 0,
          shadowOpacity: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingTop: 20
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              focused={focused} 
              icon="grid-outline" 
              label="Home"
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Upload" 
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              focused={focused} 
              icon="add-circle-outline" 
              label="Upload"
            />
          ),
        }}
      >
        {(props) => <UploadScreen {...props} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Revisit" 
        component={RevisitScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              focused={focused} 
              icon="time-outline" 
              label="Revisit"
              disabled={!hasImages}
            />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              disabled={!hasImages}
              onPress={() => {
                if (hasImages) {
                  props.onPress();
                }
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { hasImages } = useImages();
  const { userToken, isLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    isLoggedIn();
  }, []);

  if (isLoading) {
    return null; // Or a loading screen
  }


  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={userToken ? "MainTabs" : "Login"}
    >
      {!userToken ? (
        // Auth Stack
        <Stack.Group>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{
              animation: 'none'
            }}
          />
          <Stack.Screen 
            name="Signup" 
            component={SignupScreen}
            options={{
              animation: 'none'
            }}
          />
        </Stack.Group>
      ) : (
        // App Stack
        <Stack.Group>
          <Stack.Screen name="MainTabs">
            {(props) => <TabNavigator {...props} hasImages={hasImages} />}
          </Stack.Screen>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator; 