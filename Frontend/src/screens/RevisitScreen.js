import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import darkTheme from '../themes/darkTheme';
import { useImages } from '../contexts/ImageContext';

const RevisitScreen = () => {
  const { images, deleteImage } = useImages();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userDescription, setUserDescription] = useState('');
  const [finished, setFinished] = useState(false);

  // Ensure currentIndex is always valid
  useEffect(() => {
    if (currentIndex >= images.length && images.length > 0) {
      setCurrentIndex(0);
    }
  }, [images.length, currentIndex]);

  useEffect(() => {
    if (images.length === 0) {
      setFinished(false);
      setCurrentIndex(0);
    }
  }, [images.length]);

  const handleKeep = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const handleForget = () => {
    if (images.length === 0) return;
    const deletingLast = currentIndex === images.length - 1;
    deleteImage(images[currentIndex].id);
    if (deletingLast && images.length > 1) {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
    if (images.length === 1) {
      setFinished(true);
    }
  };

  const handleDoItAgain = () => {
    setCurrentIndex(0);
    setFinished(false);
  };

  if (images.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center" style={{ backgroundColor: darkTheme.background }}>
        <Text className="text-2xl font-bold mb-4" style={{ color: darkTheme.textPrimary }}>
          No more images to revisit!
        </Text>
        <Ionicons name="checkmark-circle-outline" size={64} color={darkTheme.primary} />
      </SafeAreaView>
    );
  }

  if (finished) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center" style={{ backgroundColor: darkTheme.background }}>
        <Text className="text-xl font-bold mb-8" style={{ color: darkTheme.textPrimary }}>
          You have finished revisiting all images!
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: darkTheme.primary, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 24 }}
          onPress={handleDoItAgain}
        >
          <Text style={{ color: darkTheme.textPrimary, fontSize: 14, fontWeight: 'bold' }}>Start Another Round</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Defensive: If currentIndex is out of bounds, reset to 0
  const safeIndex = currentIndex < images.length ? currentIndex : 0;
  const image = images[safeIndex];

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setUserDescription('');
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: darkTheme.background }}>
      {/* Header */}
      {/* <View className="px-6 py-4 border-b" style={{ borderColor: darkTheme.border }}>
        <Text className="text-3xl font-bold" style={{ color: darkTheme.textPrimary }}>Revisit</Text>
      </View> */}
      

      {/* Image Card UI (like HomeScreen) */}
      <View className="flex-1 justify-center items-center px-6">
        <TouchableOpacity
          className="w-full aspect-[4/3] rounded-3xl overflow-hidden border mb-4"
          style={{ backgroundColor: darkTheme.surface, borderColor: darkTheme.border }}
          onPress={openModal}
          activeOpacity={0.85}
        >
          <Image
            source={{ uri: image.uri }}
            className="w-full h-full"
            resizeMode="contain"
          />
        </TouchableOpacity>
        {/* Description */}
        {
          /* 
        <Text className="text-base mb-2 text-center" style={{ color: darkTheme.textPrimary }}>
          {image.description || 'No description available'}
        </Text>
        */
      }
        {/* Tags */}
        {/** 
        <View className="flex-row flex-wrap gap-2 mb-8 justify-center">
          {image.tags && image.tags.map((tag, idx) => (
            <View key={idx} className="px-3 py-1 rounded-full" style={{ backgroundColor: darkTheme.surface }}>
              <Text style={{ color: darkTheme.textPrimary }}>{tag}</Text>
            </View>
          ))}
          
        </View>
        */}
        {/* Buttons */}
        <View className="flex-row justify-center items-center gap-8 mt-8">
          <TouchableOpacity
            className="w-32 h-32 rounded-full justify-center items-center border-2 mr-4"
            style={{ borderColor: 'rgba(255,255,255,0.2)' }}
            onPress={handleForget}
          >
            <Text className="text-xl" style={{ color: darkTheme.textPrimary }}>
              Forget
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-32 h-32 rounded-full justify-center items-center border-2 ml-4"
            style={{ borderColor: 'rgba(255,255,255,0.2)' }}
            onPress={handleKeep}
          >
            <Text className="text-xl" style={{ color: darkTheme.textPrimary }}>
              Keep
            </Text>
          </TouchableOpacity>
        </View>
        {/* Progress Dots */}
        <View className="flex-row gap-1 mt-8 justify-center">
          {images.map((_, i) => (
            <View
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: i === safeIndex ? darkTheme.primary : 'rgba(255,255,255,0.2)' }}
            />
          ))}
        </View>
      </View>

      {/* Modal for detailed view (like HomeScreen) */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View className="flex-1" style={{ backgroundColor: darkTheme.background }}>
          {/* Header with Close Button */}
          <View className="flex-row items-center justify-between px-6 py-4">
            <TouchableOpacity
              onPress={closeModal}
              className="p-2 rounded-full"
              style={{ backgroundColor: darkTheme.surface }}
            >
              <Ionicons name="close" size={24} color={darkTheme.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Image */}
            <View className="w-full aspect-square rounded-2xl overflow-hidden mb-6">
              <Image
                source={{ uri: image.uri }}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>

            {/* Description */}
            <View className="mb-6">
              <Text style={{ color: darkTheme.textSecondary }} className="text-sm font-medium mb-2">
                Description
              </Text>
              <Text style={{ color: darkTheme.textPrimary }} className="text-base">
                {image.description || 'No description available'}
              </Text>
            </View>

            {/* Tags */}
            <View className="mb-6">
              <Text style={{ color: darkTheme.textSecondary }} className="text-sm font-medium mb-2">
                Tags
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {image.tags && image.tags.map((tag, index) => (
                  <View
                    key={index}
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: darkTheme.surface }}
                  >
                    <Text style={{ color: darkTheme.textPrimary }} className="text-sm">
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* User Description */}
            <View>
              <Text style={{ color: darkTheme.textSecondary }} className="text-sm font-medium mb-2">
                Your Description
              </Text>
              <TextInput
                className="w-full p-4 rounded-2xl text-base"
                style={{
                  backgroundColor: darkTheme.surface,
                  color: darkTheme.textPrimary,
                  borderColor: darkTheme.border,
                  borderWidth: 1
                }}
                placeholder="Add your description..."
                placeholderTextColor={darkTheme.textSecondary}
                value={userDescription}
                onChangeText={setUserDescription}
                multiline
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default RevisitScreen;