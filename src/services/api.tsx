import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';

const PREFIX_URL = process.env.NODE_ENV === 'production'
    ? "http://67.223.117.163:8080/api/v2/"
    : "http://localhost:8080/api/v2/"


enum StatusCode {
  Unauthorized = 401,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
}

const headers: Readonly<Record<string, string | boolean>> = {
  Accept: "application/json; */*",
  "Content-Type": "application/json; charset=utf-8",
  // "Access-Control-Allow-Credentials": false,
  // "X-Requested-With": "XMLHttpRequest",
};

// Function that will be called to refresh authorization
const refreshAuthLogic = (failedRequest: any) =>
    axios.post(
        PREFIX_URL + '/auth/refresh',
        {refreshToken: localStorage.getItem("refreshToken")},
        {
          headers: {
            'Authorization': `Basic ${localStorage.getItem("accessToken")}`
          }
        }
    ).then((tokenRefreshResponse: any) => {
      // alert("Refresh active 1")
      const {accessToken, refreshToken} = tokenRefreshResponse.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      failedRequest.response.config.headers['Authorization'] = 'Bearer ' + accessToken;
      return Promise.resolve();
    }) // .catch doesn't work here. Breaks App's error msg

// We can use the following function to inject the JWT token through an interceptor
// We get the `accessToken` from the localStorage that we set when we authenticate
const injectToken = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  try {
    const token = localStorage.getItem("accessToken");
    if (token != null && config.headers != null) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error: any) {
    throw new Error(error);
  }
};

class Http {
  private instance: AxiosInstance | null = null;

  private get http(): AxiosInstance {
    return this.instance != null ? this.instance : this.initHttp();
  }

  initHttp() {

    const http = axios.create({
      baseURL: PREFIX_URL,
      headers,
    });

    // Instantiate the interceptor
    createAuthRefreshInterceptor(http, refreshAuthLogic);

    http.interceptors.request.use(injectToken, (error) => Promise.reject(error));

    http.interceptors.response.use(
        (response: any) => response,
        (error: any) => {
          const { response } = error;
          return Http.handleError(response);
        }
    );

    this.instance = http;
    return http;
  }

  request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
    return this.http.request(config);
  }

  get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.http.get<T, R>(url, config);
  }

  post<T = any, R = AxiosResponse<T>>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
    return this.http.post<T, R>(url, data, config);
  }

  put<T = any, R = AxiosResponse<T>>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
    return this.http.put<T, R>(url, data, config);
  }

  delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.http.delete<T, R>(url, config);
  }

  patch<T = any, R = AxiosResponse<T>>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
    return this.http.patch<T, R>(url, data, config);
  }

  auth<T = any, R = AxiosResponse<T>>(url: string, data?: T, config?: AxiosAuthRefreshRequestConfig): Promise<R> {
    return this.http.post<T, R>(url, data, config);
  }

  // Handle global app errors
  // We can handle generic app errors depending on the status code
  private static handleError(error: any) {
    const { status } = error;

    switch (status) {
      case StatusCode.InternalServerError: {
        // Handle InternalServerError
        break;
      }
      case StatusCode.Forbidden: {
        // Handle Forbidden
        break;
      }
      case StatusCode.Unauthorized: {
        // localStorage.removeItem('user')
        // return <Navigate to="/login" replace />
        break;
      }
      case StatusCode.TooManyRequests: {
        // Handle TooManyRequests
        break;
      }
    }

    return Promise.reject(status);
  }
}

export const api = new Http();