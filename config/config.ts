/**
 * Application Configuration
 * Reads from environment variables defined in .env file
 */

import { API_BASE_URL, API_TIMEOUT, NODE_ENV } from '@env';

export const config = {
    /**
     * API Base URL - Loaded from .env
     */
    API_BASE_URL: API_BASE_URL,

    /**
     * Request timeout in milliseconds
     */
    API_TIMEOUT: parseInt(API_TIMEOUT, 10),

    /**
     * Environment flag
     */
    isDevelopment: NODE_ENV,
} as const;

/**
 * Environment-specific configurations
 * Uncomment and modify as needed for different environments
 */
// export const environments = {
//   development: {
//     API_BASE_URL: 'http://localhost:8080/api',
//   },
//   staging: {
//     API_BASE_URL: 'https://staging-api.appointmentmanager.com/api',
//   },
//   production: {
//     API_BASE_URL: 'https://api.appointmentmanager.com/api',
//   },
// };
