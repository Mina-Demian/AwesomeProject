import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

     const api = axios.create({
        baseURL: 'http://192.168.2.17:5292/api',
        });
    
      // Create an axios instance with default configuration
      api.interceptors.request.use(
        async (config) => {
          const token = await AsyncStorage.getItem('token');
          const refreshToken = await AsyncStorage.getItem('refreshToken');
      
          if (token && refreshToken) {
            // Set the Authorization header with the access token
            config.headers.Authorization = `Bearer ${token}`;
          }
      
          // Add the "x-api-key" header
          config.headers['x-api-key'] = 'Secret';
      
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );  

  api.interceptors.response.use(
    async (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      //const navigation = useNavigation();

      // Check if the error response status is 401 (unauthorized) and the original request was not a token refresh request
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (refreshToken) {
          try {
            // Make a request to the token refresh endpoint
            const response = await axios.post('http://192.168.2.17:5292/api/AuthToken/RefreshToken2', {
              refreshToken,
            }, {
              headers: {
                'Content-Type': 'application/json', // Set the Content-Type header
                'x-api-key': 'Secret', // Replace 'your-api-key' with your actual API key
              },
            });

            const newToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;

            // Update the tokens in AsyncStorage
            await AsyncStorage.setItem('token', newToken);
            await AsyncStorage.setItem('refreshToken', newRefreshToken);

            console.log(newToken);
            console.log(newRefreshToken);

            // Set the updated tokens in the request headers
            api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

            /*
            api.interceptors.request.use((config) => {
              config.headers.Authorization = `Bearer ${newToken}`;
              return config;
            });
            */

            // Retry the original request with the updated token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            // Handle the refresh error
            console.error('Token refresh failed:', refreshError);
            // Redirect the user to the Login Screen
            //navigation.navigate('Login');
            throw refreshError;
          }
        }
      }

      return Promise.reject(error);
    }
  );


export default api;
