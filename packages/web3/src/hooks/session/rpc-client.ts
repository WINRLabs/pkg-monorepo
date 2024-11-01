export type RpcSend = (request: RpcRequest<any>) => Promise<RpcResponse<any>>;
export type RpcRequest<T> = {
  jsonrpc: '2.0';
  method: string;
  params?: T;
  id?: number;
};
export interface RpcSuccessResponse<T> {
  jsonrpc: '2.0';
  id: number;
  result: T;
  error: never;
}
export interface RpcErrorResponse {
  jsonrpc: '2.0';
  id: number;
  result: never;
  error: RpcError;
}
export interface RpcError {
  code: number;
  message: string;
  data?: any;
}
export type RpcResponse<T> = RpcSuccessResponse<T> | RpcErrorResponse;

export class RpcClient {
  private id = 0;

  constructor(private send: RpcSend) {}

  request<T, R>(method: string, params?: T): Promise<R> {
    return new Promise(async (resolve, reject) => {
      const id = this.id++;

      try {
        const response = (await this.send({
          jsonrpc: '2.0',
          method,
          params,
          id,
        })) as RpcResponse<R>;

        if (response.result) {
          resolve(response.result as R);
        } else {
          reject(response.error);
        }
      } catch (err) {
        reject(err as RpcErrorResponse);
      }
    });
  }
}
