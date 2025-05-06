import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import darkTheme from '../themes/darkTheme';
import { useImages } from '../contexts/ImageContext';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();
  const { images } = useImages();

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = images.filter(image => {
      // Search in AI description
      const matchesDescription = image.description?.toLowerCase().includes(query);
      
      // Search in tags
      const matchesTags = image.tags?.some(tag => tag.toLowerCase().includes(query));
      
      // Search in user description
      const matchesUserDescription = image.userDescription?.toLowerCase().includes(query);

      return matchesDescription || matchesTags || matchesUserDescription;
    });

    setSearchResults(results);
  }, [searchQuery, images]);

  const openImageDetails = (image) => {
    // Navigate to the Everything tab and pass the selectedImageId
    navigation.navigate('MainTabs', {
      screen: 'HomeScreen',
      params: { selectedImageId: image.id }
    });
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: darkTheme.background }}>
      {/* Search Header */}
      <View className="flex-row items-center px-4 py-2 border-b" 
        style={{ borderColor: darkTheme.border }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="p-2 mr-2"
        >
          <Ionicons name="arrow-back" size={24} color={darkTheme.textPrimary} />
        </TouchableOpacity>
        <TextInput
          className="flex-1 px-4 py-2 rounded-xl text-base"
          style={{
            backgroundColor: darkTheme.surface,
            color: darkTheme.textPrimary,
            borderColor: darkTheme.border,
            borderWidth: 1,
          }}
          placeholder="Search your mind..."
          placeholderTextColor={darkTheme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus={true}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            className="p-2 ml-2"
          >
            <Ionicons name="close-circle" size={24} color={darkTheme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results */}
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {searchQuery.length > 0 ? (
          searchResults.length > 0 ? (
            <View className="flex-row flex-wrap gap-4">
              {searchResults.map((image) => (
                <TouchableOpacity
                  key={image.id}
                  className="w-[48%] aspect-square rounded-2xl overflow-hidden border"
                  style={{ 
                    backgroundColor: darkTheme.surface, 
                    borderColor: darkTheme.border,
                    paddingVertical: 8,
                    paddingHorizontal: 8,
                  }}
                  onPress={() => openImageDetails(image)}
                >
                  <Image
                    source={{ uri: image.uri }}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="items-center justify-center py-12">
              <View className="w-16 h-16 rounded-full items-center justify-center mb-4" 
                style={{ backgroundColor: darkTheme.surface }}>
                <Ionicons name="search" size={32} color={darkTheme.textSecondary} />
              </View>
              <Text style={{ color: darkTheme.textSecondary }} className="text-lg">No results found</Text>
              <Text style={{ color: darkTheme.textSecondary }} className="mt-2">Try different keywords</Text>
            </View>
          )
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen; 