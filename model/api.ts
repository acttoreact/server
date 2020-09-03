/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import http from 'http';
import io from 'socket.io';

/**
 * API module
 */
export interface APIModule {
  /**
   * Module default export. Must be a `function` and return a `Promise`. Should contain a method to be called from client
   * @memberof APIModule
   */
  default: (...args: any[]) => Promise<any>;
  /**
   * Module dispose method. Optional. Will be called when a module is disposed or updated.
   * @memberof APIModule
   */
  dispose?: () => Promise<void>;
}

/**
 * API levels structure
 */
export interface APIStructure {
  [id: string]: APIModule;
}

export interface ServerContext {
  expressServer: express.Express;
  httpServer: http.Server;
  ioServer: io.Server;
  port: number;
}

export type ServerSetupMethod = (context: ServerContext) => void | Promise<void>;

export interface ServerSetupModule {
  default: ServerSetupMethod;
}

export interface APIInfo {
  api: APIStructure;
  setup: ServerSetupMethod | null;
}