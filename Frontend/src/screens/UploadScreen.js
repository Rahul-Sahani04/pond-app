import { View, Text, TouchableOpacity, Image as RNImage, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import darkTheme from '../themes/darkTheme';
import * as ImagePicker from 'expo-image-picker';
import { useImages } from '../contexts/ImageContext';

const UploadScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const { addImage } = useImages();
  
  const selectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        setIsUploading(true);
        setError(null);
        
        try {
          const imageId = await addImage({
            uri: imageUri,
          });
          
          navigation.navigate('MainTabs', {
            screen: 'HomeScreen',
            params: {
              selectedImageId: imageId
            }
          });
        } catch (error) {
          setError(error.message || 'Failed to upload image');
        } finally {
          setIsUploading(false);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: darkTheme.background }}>
      {/* Header */}
      <View className="px-6 py-4 border-b" style={{ borderColor: darkTheme.border }}>
        <Text className="text-3xl font-bold" style={{ color: darkTheme.textPrimary }}>Upload</Text>
      </View>

      {/* Upload Area */}
      <View className="flex-1 justify-center items-center p-6">
        {error && (
          <View className="mb-4 p-4 bg-red-500/20 rounded-lg">
            <Text className="text-red-500">{error}</Text>
          </View>
        )}
        <View 
          className="w-full aspect-[4/3] rounded-3xl border-2 border-dashed justify-center items-center"
          style={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <View className="items-center">
            <Ionicons 
              name="cloud-upload-outline" 
              size={64} 
              color="rgba(255,255,255,0.5)" 
            />
            <Text 
              className="text-xl mt-4 mb-2" 
              style={{ color: darkTheme.textPrimary }}
            >
              Upload Image
            </Text>
            <Text 
              className="text-center text-base mb-6" 
              style={{ color: darkTheme.textSecondary }}
            >
              Tap to choose a file from your device
            </Text>
            {isUploading ? (
              <View className="px-6 py-3">
                <ActivityIndicator size="small" color={darkTheme.primary} />
              </View>
            ) : (
              <TouchableOpacity
                className="px-6 py-3 rounded-full"
                style={{ backgroundColor: darkTheme.primary }}
                onPress={selectImage}
                disabled={isUploading}
              >
                <Text className="text-base font-medium" style={{ color: darkTheme.textPrimary }}>
                  Choose File
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Upload Tips */}
        <View className="mt-8">
          <Text className="text-sm mb-2" style={{ color: darkTheme.textSecondary }}>
            Supported formats:
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {['JPG', 'PNG', 'GIF', 'HEIC'].map((format, index) => (
              <View
                key={index}
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: darkTheme.surface }}
              >
                <Text style={{ color: darkTheme.textPrimary }}>
                  {format}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UploadScreen; 