import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.2.17:5292/api/AuthToken/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'Secret',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, refreshToken } = data;

        console.log(data);
        // Store the token and refreshToken in AsyncStorage or other storage mechanism
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('refreshToken', refreshToken);
        // Redirect the user to the dashboard screen
        navigation.navigate('Dashboard');
      } else {
        Alert.alert('Error', 'Invalid username or password');
      }
    } catch (error) {
      console.log(error);
      console.log(error.message);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View>
      <Text>Username:</Text>
      <TextInput value={username} onChangeText={setUsername} />

      <Text>Password:</Text>
      <TextInput
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
