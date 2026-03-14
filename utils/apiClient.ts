/**
 * API Client Utility
 * Centralized HTTP client for all API requests
 */

import { config } from '../config/config';

export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public response?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export interface RequestOptions {
    headers?: Record<string, string>;
    timeout?: number;
}

class ApiClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    /**
     * Add authentication token to requests
     * Call this after user login
     */
    setAuthToken(token: string) {
        this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    /**
     * Remove authentication token
     * Call this after user logout
     */
    clearAuthToken() {
        delete this.defaultHeaders['Authorization'];
    }

    /**
     * Internal method to make HTTP requests
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit & RequestOptions = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const { headers, timeout = config.API_TIMEOUT, ...fetchOptions } = options;

        const mergedHeaders = {
            ...this.defaultHeaders,
            ...headers,
        };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(url, {
                ...fetchOptions,
                headers: mergedHeaders,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorMessage = await response.text().catch(() => response.statusText);
                throw new ApiError(
                    `HTTP ${response.status}: ${errorMessage}`,
                    response.status,
                    response
                );
            }

            // Handle empty responses (204 No Content, DELETE requests, etc.)
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                return undefined as T;
            }

            return await response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new ApiError('Request timeout', 408);
                }
                throw new ApiError(`Network error: ${error.message}`);
            }

            throw new ApiError('Unknown error occurred');
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'GET',
            ...options,
        });
    }

    /**
     * POST request
     */
    async post<T>(
        endpoint: string,
        data?: any,
        options?: RequestOptions
    ): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
    }

    /**
     * PUT request
     */
    async put<T>(
        endpoint: string,
        data?: any,
        options?: RequestOptions
    ): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
    }

    /**
     * PATCH request
     */
    async patch<T>(
        endpoint: string,
        data?: any,
        options?: RequestOptions
    ): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
            ...options,
        });
    }
}

// Export a singleton instance
export const apiClient = new ApiClient(config.API_BASE_URL);
