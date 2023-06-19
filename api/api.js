/*
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

// Add a response interceptor
api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error response status is 401 (unauthorized) and the original request was not a token refresh request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // Make a request to the token refresh endpoint
          const response = await axios.post('http://192.168.2.17:5292/api/AuthToken/RefreshToken2', {
            refreshToken,
          });

          const newToken = response.data.accessToken;
          const newRefreshToken = response.data.refreshToken;

          console.log(newToken);
          console.log(newRefreshToken);

          // Update the token in AsyncStorage
          await AsyncStorage.setItem('token', newToken);
          await AsyncStorage.setItem('refreshToken', newRefreshToken);

          // Set the updated token in the request headers
          api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

          // Retry the original request with the updated token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Handle the refresh error
          console.error('Token refresh failed:', refreshError);
          // You can redirect to the login screen or handle the error as per your application's requirements
          const navigation = useNavigation();
          navigation.navigate('Login');
          
          throw refreshError;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
*/


/* -----------------------------------------------------------------------------------------------------------------------------
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const api = axios.create({
  baseURL: 'http://192.168.2.17:5292/api', // Replace with your API base URL
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['x-api-key'] = 'Secret'; // Replace with your API key
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post('http://192.168.2.17:5292/api/AuthToken/RefreshToken2', {
            refreshToken,
          });
          const { token, refreshToken: newRefreshToken } = response.data;
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('refreshToken', newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        } catch (refreshError) {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('refreshToken');
          //const navigation = useNavigation();
          //navigation.navigate('Login'); // Navigate to the login screen
        }
      } else {
        //const navigation = useNavigation();
        //navigation.navigate('Login'); // Navigate to the login screen
      }
    }
    return Promise.reject(error);
  }
);

export default api;
*///------------------------------------------------------------------------------------------------------------------------------------


/*
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const api = axios.create({
  baseURL: 'http://192.168.2.17:5292/api', // Replace with your API base URL
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.map((cb) => cb(token));
};

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['x-api-key'] = 'Secret'; // Replace with your API key
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve) => {
            subscribeTokenRefresh((newToken) => {
              resolve(newToken);
            });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('refreshToken');
          //const navigation = useNavigation();
          //navigation.navigate('Login'); // Navigate to the login screen
        }
      } else {
        originalRequest._retry = true;
        isRefreshing = true;
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const response = await axios.post('http://192.168.2.17:5292/api/AuthToken/RefreshToken2', {
              refreshToken,
            });
            const { token, refreshToken: newRefreshToken } = response.data;
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('refreshToken', newRefreshToken);
            originalRequest.headers.Authorization = `Bearer ${token}`;
            onRefreshed(token);
            return api(originalRequest);
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('refreshToken');
            //const navigation = useNavigation();
            //navigation.navigate('Login'); // Navigate to the login screen
          } finally {
            isRefreshing = false;
            refreshSubscribers = [];
          }
        } else {
          console.error('Refresh token not found.');
          //const navigation = useNavigation();
          //navigation.navigate('Login'); // Navigate to the login screen
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
*/

import axios from 'axios';
import storage from '../storage';

const api = axios.create({
  baseURL: 'http://192.168.2.17:5292/api',
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.map((cb) => cb(token));
};

api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['x-api-key'] = 'Secret';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve) => {
            subscribeTokenRefresh((newToken) => {
              resolve(newToken);
            });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Error refreshing token (#1):', refreshError);
          await handleTokenRefreshFailure();
        }
      } else {
        originalRequest._retry = true;
        isRefreshing = true;
        const refreshToken = await getTokenFromAsyncStorage('refreshToken');        

        if (refreshToken) {
          try {
            const response = await axios.post('http://192.168.2.17:5292/api/AuthToken/RefreshToken2', {
              refreshToken,
            }, {
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'Secret',
              },
            });
            const { token, refreshToken: newRefreshToken } = response.data;
            await storeTokenInAsyncStorage('token', token);
            await storeTokenInAsyncStorage('refreshToken', newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${token}`;
            onRefreshed(token);

            /*
            const tokenCheck = await storage.getItem('token');
            const refreshTokenCheck = await storage.getItem('refreshToken');
            console.log(tokenCheck);
            console.log(refreshTokenCheck);
            */

            return api(originalRequest);
          } catch (refreshError) {
            console.error('Error refreshing token (#2):', refreshError.response);
            await handleTokenRefreshFailure();
            throw refreshError;
          } finally {
            isRefreshing = false;
            refreshSubscribers = [];
          }
        } else {
          console.error('Refresh token not found.');
          await handleTokenRefreshFailure();
        }
      }
    }
    return Promise.reject(error);
  }
);

const getTokenFromAsyncStorage = async (tokenKey) => {
  try {
    const token = await storage.getItem(tokenKey);
    console.log(token);
    return token;
  } catch (error) {
    console.error('Error retrieving token from AsyncStorage:', error);
    return null;
  }
};

const storeTokenInAsyncStorage = async (tokenKey, token) => {
  try {
    await storage.setItem(tokenKey, token);
    console.log(token);
  } catch (error) {
    console.error('Error storing token in AsyncStorage:', error);
  }
};

const handleTokenRefreshFailure = async () => {
  await storage.removeItem('token');
  await storage.removeItem('refreshToken');
};

export default api;
