import http from 'http';

/**
 * Server start response
 */
export interface ServerResponse {
  server: http.Server;
  close: () => void;
}