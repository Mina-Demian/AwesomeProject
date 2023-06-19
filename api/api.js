import axios from 'axios';
import storage from '../storage';

const api = axios.create({
  baseURL: 'apiBaseURL',
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
            const response = await axios.post('apiRefreshTokenURL', {
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
