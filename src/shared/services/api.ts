import axios, {
  AxiosRequestHeaders,
  AxiosResponseHeaders,
  RawAxiosRequestHeaders,
} from "axios";

export interface HttpResponse<T> {
  data: T;
  status: number;
  headers: AxiosResponseHeaders | Partial<RawAxiosRequestHeaders>; // Cabeçalhos retornados
  error?: string;
}

export interface HttpRequestConfig {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  headers?: AxiosRequestHeaders;
  params?: Record<string, string | number>;
  data?: <T>(data: T) => T;
}

// export class ApiClient {
//   private client: AxiosInstance;

//   constructor(baseURL: string) {
//     this.client = axios.create({
//       baseURL,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     this.client.interceptors.request.use((config) => {
//      const token = localStorage.getItem("token");

//       if (token) {
//         config.headers
//           .Authorization = `Bearer ${token}`;
//       }
//       return config;
//     });

//     this.client.interceptors.response.use(
//       (response) => {
//         return response;
//       },
//       async (error) => {
//         const originalRequest = error.config;

//         if (error.response?.status === 401 && !originalRequest._retry) {
//           originalRequest._retry = true;

//           localStorage.removeItem("token");
//           const refreshToken = localStorage.getItem("refreshToken");
//           if (!refreshToken) {
//             return Promise.reject(error);
//           }

//           const response = await api.request<{ token: string, refreshToken:string }>({
//             url: "/auth/refresh-token",
//             method: "POST",
//             data: {
//               refreshToken,
//             },
//           });
//           if (response.data.token) {
//             localStorage.setItem("token", response.data.token);
//             localStorage.setItem("refreshToken", response.data.refreshToken);
//             return this.client.request(error.config);
//           }
//         }

//         return Promise.reject(error);
//       }
//     );
//   }

//   async request<T>(config: AxiosRequestConfig): Promise<HttpResponse<T>> {
//     try {
//       const response = await this.client.request<T>(config);
//       return {
//         data: response.data,
//         status: response.status,
//         headers: response.headers,
//       };
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: Error | any) {
//       // return {
//       //   data:{} as T,
//       //   status: 500,
//       //   headers: error.response?.headers,
//       //   error: error.response?.data.message || error.message,
//       // };

//       if (error instanceof Error) {
//         throw error;
//       }
//       throw new Error(error.request.response.data);

//     }
//   }
//   setToken(token: string): void {
//     this.client.defaults.headers.Authorization = `Bearer ${token}`;
//   }

//   removeToken(): void {
//     delete this.client.defaults.headers.Authorization;
//   }
// }

// export const api = new ApiClient(import.meta.env.VITE_API_URL as string);

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


