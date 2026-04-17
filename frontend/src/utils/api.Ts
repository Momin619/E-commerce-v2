import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4500/api",
  withCredentials: true, // 🔥 VERY IMPORTANT for cookies
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });

  failedQueue = [];
};

// 🔥 RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // if already refreshing → queue requests
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(API(originalRequest)),
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        // 🔥 call refresh endpoint
        await API.post("/auth/refresh");

        processQueue(null);

        return API(originalRequest); // retry original request
      } catch (err) {
        processQueue(err);

        // ❌ BOTH TOKENS EXPIRED → logout

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default API;
