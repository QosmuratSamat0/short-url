import axios, { AxiosResponse } from 'axios';
import { UrlRequest, UrlResponse, AuthCredentials, ApiError } from '../types/api';

const API_BASE_URL = 'http://localhost:8010';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Функция для создания короткой ссылки
export const createShortUrl = async (
  urlData: UrlRequest,
  credentials: AuthCredentials
): Promise<UrlResponse> => {
  try {
    const response: AxiosResponse<UrlResponse> = await api.post('/url', urlData, {
      auth: {
        username: credentials.username,
        password: credentials.password,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiError;
    }
    throw { status: 'ERROR', error: 'Network error' } as ApiError;
  }
};

// Функция для удаления ссылки
export const deleteUrl = async (
  alias: string,
  credentials: AuthCredentials
): Promise<{ status: string }> => {
  try {
    const response = await api.delete(`/url/${alias}`, {
      auth: {
        username: credentials.username,
        password: credentials.password,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiError;
    }
    throw { status: 'ERROR', error: 'Network error' } as ApiError;
  }
};

// Функция для проверки доступности API
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await api.get('/health');
    return true;
  } catch {
    return false;
  }
};
