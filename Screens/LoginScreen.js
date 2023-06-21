import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import storage from '../storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiInterceptor from '../api/interceptor';
import { useNavigation } from '@react-navigation/native';


const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      /*
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
*/
      const api = await apiInterceptor();

      const response = await api.post('http://192.168.2.17:5292/api/AuthToken/Login', {
        username,
        password,
      });

      if (response.status === 200) {
        const data = response.data;
        const { token, refreshToken } = data;
        console.log(data);

        await storage.setItem('token', token);
        await storage.setItem('refreshToken', refreshToken);
        
        const tokenCheck = await storage.getItem('token');
        const refreshTokenCheck = await storage.getItem('refreshToken');
        console.log(tokenCheck);
        console.log(refreshTokenCheck);
        

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
