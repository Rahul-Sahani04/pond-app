import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import darkTheme from '../themes/darkTheme';
import { useAuth } from '../contexts/AuthContext';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, error, isLoading, clearError } = useAuth();

  useEffect(() => {
    return () => clearError();
  }, []);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      return;
    }

    const success = await signup(name, email, password);
    if (success) {
      // Navigate to login screen after successful signup
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: darkTheme.background }}>
      <View className="px-6 py-4">
        <Text className="text-3xl font-bold mb-8" style={{ color: darkTheme.textPrimary }}>
          Create Account
        </Text>

        {error && (
          <View className="mb-4 p-4 bg-red-500/20 rounded-lg">
            <Text className="text-red-500">{error}</Text>
          </View>
        )}

        <View className="space-y-4">
          <View>
            <Text className="text-sm mb-1" style={{ color: darkTheme.textSecondary }}>
              Name
            </Text>
            <TextInput
              className="p-4 rounded-lg mb-2"
              style={{
                backgroundColor: darkTheme.surface,
                color: darkTheme.textPrimary,
                borderWidth: 1,
                borderColor: darkTheme.border,
              }}
              placeholder="Enter your name"
              placeholderTextColor={darkTheme.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <Text className="text-sm mb-1" style={{ color: darkTheme.textSecondary }}>
              Email
            </Text>
            <TextInput
              className="p-4 rounded-lg mb-2"
              style={{
                backgroundColor: darkTheme.surface,
                color: darkTheme.textPrimary,
                borderWidth: 1,
                borderColor: darkTheme.border,
              }}
              placeholder="Enter your email"
              placeholderTextColor={darkTheme.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text className="text-sm mb-1" style={{ color: darkTheme.textSecondary }}>
              Password
            </Text>
            <TextInput
              className="p-4 rounded-lg mb-4"
              style={{
                backgroundColor: darkTheme.surface,
                color: darkTheme.textPrimary,
                borderWidth: 1,
                borderColor: darkTheme.border,
              }}
              placeholder="Choose a password"
              placeholderTextColor={darkTheme.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {isLoading ? (
            <View className="p-4">
              <ActivityIndicator size="small" color={darkTheme.primary} />
            </View>
          ) : (
            <TouchableOpacity
              className="bg-blue-500 p-4 rounded-lg items-center"
              style={{ backgroundColor: darkTheme.primary }}
              onPress={handleSignup}
            >
              <Text className="text-white font-medium">Sign Up</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="mt-4 items-center"
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={{ color: darkTheme.textSecondary }}>
              Already have an account?{' '}
              <Text style={{ color: darkTheme.primary }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;