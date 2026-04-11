import api from './api';

/**
 * Abstract Base Service — OOP Foundation
 * Encapsulates common HTTP operations and error handling.
 * All domain service classes inherit from this base.
 */
export abstract class BaseService {
  protected basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  protected async get<T>(path: string = '', params?: Record<string, any>): Promise<T> {
    const response = await api.get(`${this.basePath}${path}`, { params });
    return response.data as T;
  }

  protected async post<T>(path: string = '', data?: any, config?: any): Promise<T> {
    const response = await api.post(`${this.basePath}${path}`, data, config);
    return response.data as T;
  }

  protected async put<T>(path: string = '', data?: any): Promise<T> {
    const response = await api.put(`${this.basePath}${path}`, data);
    return response.data as T;
  }

  protected async delete<T>(path: string = ''): Promise<T> {
    const response = await api.delete(`${this.basePath}${path}`);
    return response.data as T;
  }
}
