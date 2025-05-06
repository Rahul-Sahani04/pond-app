import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import darkTheme from '../themes/darkTheme';
import { useImages } from '../contexts/ImageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import ImageDrawer from '../components/ImageDrawer';

const HomeScreen = ({ route, navigation }) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  
  const { images, loading, deleteImage, updateImage, fetchImages } = useImages();
  const { user, logout } = useAuth();
  const { hasImages } = useImages();

  useEffect(() => {
    if (route.params?.selectedImageId) {
      const image = images.find(img => img.id === route.params.selectedImageId);
      if (image) {
        setSelectedImage(image);
        setIsDrawerVisible(true);
        navigation.setParams({ selectedImageId: undefined });
      }
    }
  }, [route.params?.selectedImageId, images]);

  const openDrawer = (image) => {
    setSelectedImage(image);
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
    setSelectedImage(null);
  };

  const handleDescriptionChange = (text) => {
    if (selectedImage) {
      const updatedImage = { ...selectedImage, additionalInfo: text };
      setSelectedImage(updatedImage);
    }
  };

  const navigateToUpload = () => {
    navigation.navigate('Upload');
  };

  // Check if user is logged in
  useEffect(() => {
    const initializeScreen = async () => {
      const isLoggedIn = await AsyncStorage.getItem('userToken');
      if (!isLoggedIn) {
        navigation.navigate('Login');
        return;
      }
      try {
        await fetchImages();
      } catch (err) {
        setError(err.message);
        console.error('Error fetching images:', err);
      }
    };
    initializeScreen();
  }, []);
  
  if (error) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: darkTheme.background }}>
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-xl text-center mb-4" style={{ color: darkTheme.textPrimary }}>
            Error loading images: {error}
          </Text>
          <TouchableOpacity
            className="px-6 py-3 rounded-full"
            style={{ backgroundColor: darkTheme.primary }}
            onPress={() => {
              setError(null);
              fetchImages();
            }}
          >
            <Text className="text-base font-medium" style={{ color: darkTheme.textPrimary }}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: darkTheme.background }}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl" style={{ color: darkTheme.textPrimary }}>
            Loading images...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (images.length === 0) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: darkTheme.background }}>
        <SearchBar />
        <View className="flex-1 justify-center items-center px-6">
          <View className="w-24 h-24 rounded-full justify-center items-center mb-6" 
                style={{ backgroundColor: darkTheme.surface }}>
            <Ionicons name="images-outline" size={48} color={darkTheme.textSecondary} />
          </View>
          <Text className="text-2xl font-bold text-center mb-2" style={{ color: darkTheme.textPrimary }}>
            No Images Yet
          </Text>
          <Text className="text-base text-center mb-8" style={{ color: darkTheme.textSecondary }}>
            Start by uploading your first image to begin your journey
          </Text>
          <TouchableOpacity
            className="px-6 py-3 rounded-full"
            style={{ backgroundColor: darkTheme.primary }}
            onPress={navigateToUpload}
          >
            <Text className="text-base font-medium" style={{ color: darkTheme.textPrimary }}>
              Upload Image
            </Text>
          </TouchableOpacity>

          
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: darkTheme.background }}>
      {/* Header */}
      <SearchBar />

      {/* Content Grid */}
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4 mt-10 mb-20 grid grid-cols-3 min-h-screen">
          {images.map((image) => {
            const aspectRatio = image.width && image.height ? image.width / image.height : 3 / 3;
            return (
              <View key={image.id} style={{ marginBottom: 16, aspectRatio }}>
                <TouchableOpacity
                  className="rounded-2xl overflow-hidden border h-full"
                  style={{ 
                    backgroundColor: darkTheme.surface, 
                    borderColor: darkTheme.border,
                    paddingVertical:8,
                    paddingHorizontal:8,
                  }}
                  onPress={() => openDrawer(image)}
                >
                  <Image
                    source={{ uri: image.uri }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Image Drawer */}
      <ImageDrawer
        isVisible={isDrawerVisible}
        onClose={closeDrawer}
        imageData={selectedImage}
        onDescriptionChange={handleDescriptionChange}
      />
    </SafeAreaView>
  );
};

export default HomeScreen; 