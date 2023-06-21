/*
import axios from 'axios';
import storage from '../storage';
import jwt_decode from "jwt-decode";

const api = axios.create({
  baseURL: 'apiBaseURL',
});

api.interceptors.request.use(
    async (config) => {
      const token = await storage.getItem('token');
      var decoded = jwt_decode(token);
      decoded.exp
      console.log(decoded);
      if (token && decoded) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers['x-api-key'] = 'Secret';
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);
*/

/*
import { useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import storage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const useApiInterceptor = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const api = axios.create({
      baseURL: 'http://192.168.2.17:5292/api', // Replace with your API base URL
    });

    const requestInterceptor = api.interceptors.request.use(
      async (config) => {
        const token = await storage.getItem('token');

        if (token) {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            const refreshToken = await storage.getItem('refreshToken');

            try {
              const refreshResponse = await api.post(
                'http://192.168.2.17:5292/api/AuthToken/RefreshToken2',
                {
                  refreshToken,
                },
                {
                  headers: {
                    'x-api-key': 'Secret', // Replace with your API key
                  },
                }
              );

              await storage.setItem(
                'token',
                refreshResponse.data.accessToken
              );
              await storage.setItem(
                'refreshToken',
                refreshResponse.data.refreshToken
              );

              config.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
            } catch (error) {
              console.error('Failed to refresh token:', error);
              // Handle token refresh failure, e.g., logout the user
            }
          } else {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized request:', error);

          // Handle unauthorized request, e.g., redirect to login screen
          if (!error.config.url.includes('/login')) {
            storage.removeItem('token');
            storage.removeItem('refreshToken');

            navigation.navigate('LoginScreen');
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return null;
};

export default useApiInterceptor;
*/

import axios from 'axios';
import jwtDecode from 'jwt-decode';
//import storage from '@react-native-async-storage/async-storage';
import storage from '../storage';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

const apiInterceptor = async () => {
  //const navigation = useNavigation();

  // Create an Axios instance with a base URL
  const api = axios.create({
    baseURL: 'http://192.168.2.17:5292/api', // Replace with your API base URL
  });

  // Request Interceptor
  api.interceptors.request.use(async (config) => {
    // Retrieve the JWT token from storage
    const token = await storage.getItem('token');

    // Check if the token exists and is not expired
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);

      // Calculate the token expiration time
      const currentTime = Date.now() / 1000;
      console.log(currentTime);
      if (decodedToken.exp < currentTime) {
        // Token expired, call the Refresh Token endpoint
        const refreshToken = await storage.getItem('refreshToken');

        // Make a request to your Refresh Token endpoint
        const refreshResponse = await axios.post(
          'http://192.168.2.17:5292/api/AuthToken/RefreshToken2',
          {
            refreshToken,
          },
          {
            headers: {
              'x-api-key': 'Secret', // Replace with your API key
            },
          }
        );

        //console.log(refreshResponse.data.token);
        //console.log(refreshResponse.data.refreshToken)
        // Update the tokens in storage if they exist
        if (refreshResponse.data.token) {
            await storage.setItem('token', refreshResponse.data.token);
          }
          if (refreshResponse.data.refreshToken) {
            await storage.setItem('refreshToken', refreshResponse.data.refreshToken);
          }
        
        const newTokenCheck = await storage.getItem('token');
        const newrefreshTokenCheck = await storage.getItem('refreshToken');
        console.log(newTokenCheck);
        console.log(newrefreshTokenCheck);
        // Set the Authorization header with the new token
        config.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
      } else {
        // Token is still valid, set the Authorization header
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    config.headers['x-api-key'] = 'Secret';

    return config;
  });

  // Response Interceptor
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Check if the error status is 401 (Unauthorized)
      if (error.response && error.response.status === 401) {
        // Log the error
        console.error('Unauthorized request:', error.response);
        Alert.alert('Refresh Token is Expired', 'Please Login Again');

        // Handle unauthorized request logic here
        // For example, redirect the user to the login screen
        if (!originalRequest.url.includes('/login')) {
          // Clear the tokens from storage
          await storage.removeItem('token');
          await storage.removeItem('refreshToken');
          // Redirect to the login screen
          //navigation.navigate('LoginScreen');
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

//const api = apiInterceptor();

export default apiInterceptor;
