import axios from 'axios';
import jwtDecode from 'jwt-decode';
import storage from '../storage';
import { Alert } from 'react-native';

const apiInterceptor = async () => {

  const api = axios.create({
    baseURL: 'http://192.168.2.17:5292/api',
  });


  api.interceptors.request.use(async (config) => {

    const token = await storage.getItem('token');


    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);


      const currentTime = Date.now() / 1000;
      console.log(currentTime);
      if (decodedToken.exp < currentTime) {

        const refreshToken = await storage.getItem('refreshToken');

        const refreshResponse = await axios.post(
          'http://192.168.2.17:5292/api/AuthToken/RefreshToken2',
          {
            refreshToken,
          },
          {
            headers: {
              'x-api-key': 'Secret',
            },
          }
        );

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

        config.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    config.headers['x-api-key'] = 'Secret';

    return config;
  });




  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response && error.response.status === 401) {
        console.error('Unauthorized request:', error.response);
        Alert.alert('Refresh Token is Expired', 'Please Login Again');

        if (!originalRequest.url.includes('/login')) {
          await storage.removeItem('token');
          await storage.removeItem('refreshToken');
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

export default apiInterceptor;
