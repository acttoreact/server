/* eslint-disable @typescript-eslint/no-explicit-any */
import { Socket } from 'socket.io';

/**
 * Socket basic call
 */
export interface SocketCall {
  /**
   * Unique ID for socket transmission
   * @memberof SocketCall
   */
  id: string;
}

/**
 * Socket method call
 */
export interface MethodCall extends SocketCall {
  /**
   * API Method name corresponding to complete key (like 'users.login')
   * @memberof MethodCall
   */
  method: string;
  /**
   * Params for API Method
   * @memberof MethodCall
   */
  params: any[];
};

/**
 * Socket standard response
 */
export interface SocketMessage {
  /**
   * Operation was ok (0) or not (1)
   * @memberof SocketMessage
   */
  o: number;
  /**
   * Operation error (if any)
   * @memberof SocketMessage
   */
  e?: string;
  /**
   * Operation stack (if error)
   * @memberof SocketMessage
   */
  s?: string;
  /**
   * Operation return data
   * @memberof SocketMessage
   */
  d: any;
};

/**
 * A2R Socket
 */
export interface A2RSocket extends Socket {
  sessionId: string;
  userToken?: string;
};
