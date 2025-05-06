import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Modal,
    Dimensions,
    Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import darkTheme from "../themes/darkTheme";
import { useAuth } from "../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [drawerVisible, setDrawerVisible] = useState(false);
    const drawerAnim = useRef(
        new Animated.Value(-Dimensions.get("window").width * 0.8)
    ).current;
    const navigation = useNavigation();

    const { logout } = useAuth();

    const openDrawer = () => {
        setDrawerVisible(true);
        Animated.timing(drawerAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const closeDrawer = () => {
        Animated.timing(drawerAnim, {
            toValue: -Dimensions.get("window").width * 0.8,
            duration: 300,
            useNativeDriver: false,
        }).start(() => setDrawerVisible(false));
    };

    return (
        <>
            <View
                style={{ backgroundColor: darkTheme.background }}
                className="mt-2"
            >
                <View
                    className="flex-row gap-4 px-6 py-4 border-b"
                    style={{ borderColor: darkTheme.border }}
                >
                    {/* Menu Button */}
                    <TouchableOpacity
                        className="flex justify-center items-center p-2 rounded-full"
                        onPress={openDrawer}
                    >
                        <Image
                            source={require("../assets/icon.png")}
                            style={{ width: 40, height: 30 }}
                        />
                    </TouchableOpacity>

                    {/* Search Input */}
                    <TouchableOpacity
                        className="flex-row flex-1 items-center rounded-2xl px-4 py-3 border"
                        onPress={() => navigation.navigate("Search")}
                        style={{
                            backgroundColor: darkTheme.surface,
                            borderColor: darkTheme.border,
                        }}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="search"
                            size={20}
                            color={darkTheme.textSecondary}
                        />
                        <Text
                            className="flex-1 ml-3 text-base"
                            style={{ color: darkTheme.textSecondary }}
                        >
                            Search your mind...
                        </Text>
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setSearchQuery("")}
                                className="p-1"
                            >
                                <Ionicons
                                    name="close-circle"
                                    size={20}
                                    color={darkTheme.textSecondary}
                                />
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                visible={drawerVisible}
                animationType="none"
                transparent
                onRequestClose={closeDrawer}
            >
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.3)",
                        flexDirection: "row",
                    }}
                    activeOpacity={1}
                    onPress={closeDrawer}
                >
                    <Animated.View
                        style={{
                            width: Dimensions.get("window").width * 0.8,
                            height: "100%",
                            backgroundColor: darkTheme.surface,
                            padding: 32,
                            shadowColor: "#000",
                            shadowOffset: { width: 2, height: 0 },
                            shadowOpacity: 0.2,
                            shadowRadius: 12,
                            elevation: 12,
                            transform: [{ translateX: drawerAnim }],
                            borderTopRightRadius: 32,
                            borderBottomRightRadius: 32,
                        }}
                        onStartShouldSetResponder={() => true}
                        onTouchEnd={(e) => e.stopPropagation()}
                    >
                        {/* Pond App Details */}
                        <Text
                            style={{
                                color: darkTheme.primary,
                                fontSize: 44,
                                fontWeight: "bold",
                                marginBottom: 6,
                                letterSpacing: 1.5,
                            }}
                        >
                            Pond
                        </Text>
                        <View style={{ marginBottom: 36, marginTop: 40 }}>
                            <Text
                                style={{
                                    color: darkTheme.primary,
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    marginBottom: 8,
                                    letterSpacing: 1,
                                }}
                            >
                                Effortless Memories
                            </Text>
                            <Text
                                style={{
                                    color: darkTheme.textPrimary,
                                    fontSize: 16,
                                    fontWeight: "600",
                                    marginBottom: 2,
                                }}
                            >
                                Organize, search, and revisit your best moments
                                with smart AI tags and instant search.
                            </Text>
                            <Text
                                style={{
                                    color: darkTheme.textSecondary,
                                    fontSize: 15,
                                    marginTop: 8,
                                    lineHeight: 22,
                                }}
                            >
                                <Text
                                    style={{
                                        color: darkTheme.primary,
                                        fontWeight: "700",
                                    }}
                                >
                                    Pond
                                </Text>{" "}
                                keeps your memories safe, beautifully organized,
                                and always at your fingertips. Let AI handle the
                                details, so you can focus on living and reliving
                                your favorite experiences.
                            </Text>
                        </View>

                        {/* User Email */}
                        {/* {userEmail && (
                            <View style={{ marginBottom: 40 }}>
                                <Text style={{ color: darkTheme.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 4 }}>Logged in as</Text>
                                <Text style={{ color: darkTheme.textSecondary, fontSize: 16, fontWeight: '500', letterSpacing: 0.2 }}>{userEmail}</Text>
                            </View>
                        )} */}

                        {/* Log Out Button */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: darkTheme.primary,
                                paddingVertical: 16,
                                paddingHorizontal: 32,
                                borderRadius: 100,
                                alignSelf: "flex-start",
                                marginTop: 16,
                                shadowColor: darkTheme.primary,
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.25,
                                shadowRadius: 8,
                                elevation: 6,
                            }}
                            activeOpacity={0.85}
                            onPress={() => {
                                logout();
                                navigation.navigate("Login");
                                AsyncStorage.removeItem("userToken");
                                // navigation.navigate("MainTabs", {
                                //     screen: "LoginScreen",
                                // });
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    letterSpacing: 1,
                                    textAlign: "center",
                                }}
                            >
                                Log Out
                            </Text>
                        </TouchableOpacity>
                        {/* Add your drawer items here */}
                    </Animated.View>
                    <View style={{ flex: 1 }} />
                </TouchableOpacity>
            </Modal>
        </>
    );
};

export default SearchBar;
