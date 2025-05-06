import React, { useRef, useState, useCallback, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import darkTheme from "../themes/darkTheme";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useImages } from "../contexts/ImageContext";

const ImageDrawer = ({
    isVisible,
    onClose,
    imageData,
    onDescriptionChange,
}) => {
    const { userToken } = useAuth();
    const { updateImage } = useImages();
    const [isSaving, setIsSaving] = useState(false);
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const [showAddTagPrompt, setShowAddTagPrompt] = useState(false);
    const [newTag, setNewTag] = useState("");
    const saveTimeout = useRef(null);
    const [localDescription, setLocalDescription] = useState(imageData?.additionalInfo);

    const [tags, setTags] = useState([]);

    useEffect(() => {
        if (imageData?.tags) {
            setTags(imageData.tags);
        }
    }, [imageData]);

    const API_URL =
        process.env.EXPO_PUBLIC_API_URL || "http://192.168.31.21:3000/api";

    const tagColors = [
        "#98CDC8",
        "#F706AF",
        "#1767B5",
        "#6F98CC",
        "#FC9471",
        "#D85D73",
        "#BB7484",
        "#F483A8",
        "#E1B5E0",
        "#598DCD",
        "#14AE4A",
        "#2755AD",
        "#87351B",
        "#002176",
        "#06FC4E",
        "#99F5B2",
        "#35484F",
        "#B2F06E",
        "#119E29",
        "#4929BF",
        "#1C516A",
        "#83988B",
        "#0DA71A",
        "#CF51B9",
        "#1CEF7E",
        "#35EF4A",
        "#A9B401",
        "#2FF930",
        "#995664",
        "#DE34C8"
    ];
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const saveDescription = useCallback(
        async (description) => {
            if (!imageData?.id) return;

            try {
                setIsSaving(true);
                await axios.put(
                    `${API_URL}/images/${imageData.id}/description`,
                    {
                        userDescription: description,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                );
                // Update the local state in ImageContext
                updateImage(imageData.id, { additionalInfo: description });
            } catch (error) {
                console.error("Error saving description:", error);
            } finally {
                setIsSaving(false);
            }
        },
        [imageData?.id, userToken, updateImage]
    );

    const handleDescriptionChange = useCallback(
        (text) => {
            // Update local state immediately
            setLocalDescription(text);
            onDescriptionChange(text);

            // Clear any existing timeout
            if (saveTimeout.current) {
                clearTimeout(saveTimeout.current);
            }

            // Set a new timeout to save after 1 second of no typing
            saveTimeout.current = setTimeout(() => {
                saveDescription(text);
            }, 1000);
        },
        [onDescriptionChange, saveDescription]
    );

    // Update local description when imageData changes
    React.useEffect(() => {
        setLocalDescription(imageData?.additionalInfo);
    }, [imageData]);

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}/images/${imageData.id}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            setShowDeletePrompt(false);
            onClose();
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    const handleAddTag = async () => {
        const tagToAdd = newTag.trim();
        if (!tagToAdd) return;

        // Check for duplicate tag
        if (imageData.tags?.includes(tagToAdd)) {
            alert('This tag already exists');
            return;
        }

        try {
            const updatedTags = [...(imageData.tags || []), tagToAdd];
            await axios.put(
                `${API_URL}/images/${imageData.id}/tags`,
                { tags: updatedTags },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            updateImage(imageData.id, { tags: updatedTags });
            setNewTag("");
            setShowAddTagPrompt(false);
            setTags(updatedTags);
        } catch (error) {
            console.error("Error adding tag:", error);
        }
    };

    const handleDeleteTag = async (tagToDelete) => {
        try {
            const updatedTags = imageData.tags.filter(tag => tag !== tagToDelete);
            await axios.put(
                `${API_URL}/images/${imageData.id}/tags`,
                { tags: updatedTags },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            updateImage(imageData.id, { tags: updatedTags });
        } catch (error) {
            console.error("Error deleting tag:", error);
        }
    };

    if (!isVisible) return null;

    return (
        <View className="absolute inset-0">
            <Modal
                visible={isVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={onClose}
            >
                <View className="flex-1" style={{ backgroundColor: darkTheme.background }}>
                    {/* Header with Close and Delete Button */}
                    <View className="flex-row items-center justify-between px-6 py-4">
                        <TouchableOpacity
                            onPress={onClose}
                            className="p-2 rounded-full"
                            style={{ backgroundColor: darkTheme.surface }}
                        >
                            <Ionicons name="close" size={24} color={darkTheme.textPrimary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setShowDeletePrompt(true)}
                            className="p-2 rounded-full"
                            style={{ backgroundColor: '#e53935', marginLeft: 'auto' }}
                        >
                            <Ionicons name="trash" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Delete Prompt Modal */}
                    <Modal
                        visible={showDeletePrompt}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setShowDeletePrompt(false)}
                    >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <View style={{ backgroundColor: darkTheme.surface, padding: 24, borderRadius: 16, width: 300, alignItems: 'center' }}>
                                <Text style={{ color: darkTheme.textPrimary, fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
                                    Are you sure want to delete the image?
                                </Text>
                                <View style={{ flexDirection: 'row', marginTop: 16 }}>
                                    <TouchableOpacity
                                        style={{ backgroundColor: '#e53935', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8, marginRight: 12 }}
                                        onPress={handleDelete}
                                    >
                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Yes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ backgroundColor: darkTheme.primary, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 }}
                                        onPress={() => setShowDeletePrompt(false)}
                                    >
                                        <Text style={{ color: darkTheme.textPrimary, fontWeight: 'bold' }}>No</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* Content */}
                    <ScrollView
                        className="flex-1"
                        contentContainerStyle={{ padding: 24 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Image */}
                        <View className="w-full aspect-square rounded-2xl overflow-hidden mb-6">
                            <Image
                                source={{ uri: imageData.uri }}
                                className="w-full h-full"
                                resizeMode="contain"
                            />
                        </View>

                        {/* AI Description */}
                        <View className="mb-6">
                            <Text style={{ color: darkTheme.textSecondary }} className="text-sm font-medium mb-2">
                                AI Description
                            </Text>
                            <Text style={{ color: darkTheme.textPrimary }} className="text-base">
                                {imageData?.description || 'No description available'}
                            </Text>
                        </View>

                        {/* Tags */}
                        <View className="mb-6">
                            <Text style={{ color: darkTheme.textSecondary }} className="text-sm font-medium mb-2">
                                Tags
                            </Text>
                            
                            {/* Add Tag Button */}
                            <View className="flex-row items-center mb-4">
                                <TouchableOpacity
                                    className="py-3 px-1 rounded-xl items-center justify-center"
                                    style={{
                                        backgroundColor: darkTheme.primary,
                                        width: '30%'
                                    }}
                                    onPress={() => setShowAddTagPrompt(true)}
                                >
                                    <View className="flex-row items-center">
                                        <Ionicons name="add-circle-outline" size={16} color={darkTheme.textPrimary} />
                                        <Text style={{ color: darkTheme.textPrimary }} className="text-base font-medium ml-2">
                                            Add Tag
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {/* Tags List */}
                            <View className="flex-row flex-wrap gap-2">
                                {
                                tags.map((tag, index) => (
                                    <View
                                        key={index}
                                        className="flex-row items-center px-3 py-1 rounded-full"
                                        style={{
                                            backgroundColor: tagColors[index],
                                            opacity: 0.8
                                        }}
                                    >
                                        <Text style={{ color: '#fff', fontWeight: '500' }} className="text-sm">
                                            {tag}
                                        </Text>
                                        <TouchableOpacity
                                            className="ml-2"
                                            onPress={() => handleDeleteTag(tag)}
                                        >
                                            <Ionicons name="close-circle" size={16} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>

                            {/* Add Tag Prompt Modal */}
                            <Modal
                                visible={showAddTagPrompt}
                                transparent={true}
                                animationType="fade"
                                onRequestClose={() => setShowAddTagPrompt(false)}
                            >
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                    <View style={{ backgroundColor: darkTheme.surface, padding: 24, borderRadius: 16, width: 300 }}>
                                        <Text style={{ color: darkTheme.textPrimary, fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
                                            Add New Tag
                                        </Text>
                                        <TextInput
                                            className="w-full p-3 rounded-xl text-base mb-4"
                                            style={{
                                                backgroundColor: darkTheme.background,
                                                color: darkTheme.textPrimary,
                                                borderColor: darkTheme.border,
                                                borderWidth: 1
                                            }}
                                            placeholder="Enter tag name..."
                                            placeholderTextColor={darkTheme.textSecondary}
                                            value={newTag}
                                            onChangeText={setNewTag}
                                            autoFocus={true}
                                            onSubmitEditing={handleAddTag}
                                            returnKeyType="done"
                                        />
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: darkTheme.background,
                                                    paddingVertical: 10,
                                                    paddingHorizontal: 24,
                                                    borderRadius: 8,
                                                    flex: 1,
                                                    marginRight: 8
                                                }}
                                                onPress={() => {
                                                    setShowAddTagPrompt(false);
                                                    setNewTag('');
                                                }}
                                            >
                                                <Text style={{ color: darkTheme.textPrimary, textAlign: 'center', fontWeight: 'bold' }}>
                                                    Cancel
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: darkTheme.primary,
                                                    paddingVertical: 10,
                                                    paddingHorizontal: 24,
                                                    borderRadius: 8,
                                                    flex: 1,
                                                    marginLeft: 8
                                                }}
                                                onPress={handleAddTag}
                                            >
                                                <Text style={{ color: darkTheme.textPrimary, textAlign: 'center', fontWeight: 'bold' }}>
                                                    Save
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
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
                                value={localDescription}
                                onChangeText={handleDescriptionChange}
                                multiline
                            />
                            {isSaving && (
                                <Text style={{ color: darkTheme.textSecondary }} className="text-xs mt-1">
                                    Saving...
                                </Text>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
};

export default ImageDrawer;
