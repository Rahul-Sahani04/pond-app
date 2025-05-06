import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { Platform } from "react-native";
import { useAuth } from "./AuthContext";

// For physical device testing, make sure this IP matches your computer's current local IP
// You can find this by running 'ipconfig' in Command Prompt and looking for IPv4 address
const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.31.21:3000/api";

// Test connection to server
const testConnection = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    console.log("Server connection test:", response.data);
    return true;
  } catch (error) {
    console.error("Server connection test failed:", error.message);
    return false;
  }
};

// Helper to get mime type from uri
const getMimeType = (uri) => {
  const extension = uri.split(".").pop().toLowerCase();
  const types = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    heic: "image/heic",
  };
  return types[extension] || "image/jpeg";
};

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [hasImages, setHasImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userToken } = useAuth();

  const fetchImages = async () => {
    try {
      if (!userToken) {
        throw new Error("Authentication required");
      }
      setLoading(true);
      const response = await axios.get(`${API_URL}/images`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.data.success) {
        const fetchedImages = response.data.images.map((img) => ({
          id: img._id,
          uri: img.url,
          description: img.description || "",
          additionalInfo: img.additionalInfo || "",
          tags: img.tags || [],
          timestamp: img.createdAt,
          width: img.width,
          height: img.height,
        }));
        setImages(fetchedImages);
        setHasImages(fetchedImages.length > 0);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (imageUri) => {
    try {
      // Test connection first
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error(
          "Cannot connect to server. Please check your network connection and server status."
        );
      }

      if (!userToken) {
        throw new Error("Authentication required");
      }

      const mimeType = getMimeType(imageUri);
      const fileName = imageUri.split("/").pop();
      console.log("Uploading image:", {
        uri: imageUri,
        mimeType,
        fileName,
        apiUrl: API_URL,
      });

      const formData = new FormData();

      // Handle base64 data URI
      if (imageUri.startsWith("data:")) {
        const base64Data = imageUri.split(",")[1];
        const blob = await fetch(imageUri).then((r) => r.blob());
        formData.append("image", blob, fileName);
      } else {
        // Handle file URI
        formData.append("image", {
          uri:
            Platform.OS === "android"
              ? imageUri
              : imageUri.replace("file://", ""),
          type: mimeType,
          name: fileName,
        });
      }

      // Debug the actual image object being appended
      const imageObject = {
        uri:
          Platform.OS === "android"
            ? imageUri
            : imageUri.replace("file://", ""),
        type: mimeType,
        name: fileName,
      };
      console.log("Image object being appended:", imageObject);

      // Log FormData entries
      for (let [key, value] of formData.entries()) {
        console.log(`FormData entry - ${key}:`, value);
      }

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
        timeout: 30000, // 30 second timeout
      });

      if (response.data.success) {
        return response.data.image;
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
      }
      if (error.response?.status === 401) {
        throw new Error("Please login to upload images");
      }
      throw error;
    }
  };

  const addImage = async (image) => {
    try {
      // Upload to backend first
      const uploadedImage = await uploadImage(image.uri);

      // Then add to local state
      const newImage = {
        id: uploadedImage._id,
        uri: uploadedImage.url,
        description: uploadedImage.description || "",
        additionalInfo: uploadedImage.additionalInfo || "",
        tags: uploadedImage.tags || [],
        timestamp: uploadedImage.createdAt || new Date().toISOString(),
      };

      console.log("New image added:", newImage);

      setImages((prevImages) => [...prevImages, newImage]);
      setHasImages(true);

      return newImage.id;
    } catch (error) {
      console.error("Error in addImage:", error);
      throw error;
    }
  };

  const updateImage = (id, updates) => {
    setImages((prevImages) =>
      prevImages.map((image) =>
        image.id === id ? { ...image, ...updates } : image
      )
    );
  };

  const deleteImage = async (id) => {
    try {
      if (!userToken) {
        throw new Error("Authentication required");
      }

      const response = await axios.delete(`${API_URL}/images/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.data.success) {
        setImages((prevImages) =>
          prevImages.filter((image) => image.id !== id)
        );
        if (images.length === 1) {
          setHasImages(false);
        }
      } else {
        throw new Error(response.data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  };

  return (
    <ImageContext.Provider
      value={{
        images,
        hasImages,
        loading,
        addImage,
        updateImage,
        deleteImage,
        fetchImages,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImages = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImages must be used within an ImageProvider");
  }
  return context;
};
