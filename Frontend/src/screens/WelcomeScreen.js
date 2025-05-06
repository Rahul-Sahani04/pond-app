import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import darkTheme from '../themes/darkTheme';

const WelcomeScreen = () => {
  const navigation = useNavigation();



  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: darkTheme.background }}>
      <View className="flex-1 items-center justify-center px-8">
        {/* Welcome Text */}
        <Text 
          className="text-4xl font-bold text-center mb-6" 
          style={{ color: darkTheme.textPrimary }}
        >
          Welcome to POND
        </Text>

        {/* App Details */}
        <View className="mb-12">
          <Text 
            className="text-lg text-center mb-4" 
            style={{ color: darkTheme.textSecondary }}
          >
            Your personal space to organize and explore your visual memories
          </Text>
          <Text 
            className="text-base text-center" 
            style={{ color: darkTheme.textSecondary }}
          >
            Upload images, add descriptions, and let AI help you organize your thoughts
          </Text>
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          className="flex-row items-center px-6 py-4 rounded-2xl"
          style={{ backgroundColor: darkTheme.primary }}
          onPress={() => navigation.navigate('Upload')}
        >
          <Ionicons name="cloud-upload-outline" size={24} color={darkTheme.textPrimary} />
          <Text 
            className="text-lg font-semibold ml-2" 
            style={{ color: darkTheme.textPrimary }}
          >
            Upload Your First Image
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen; 