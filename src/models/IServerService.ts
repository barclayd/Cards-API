export interface IServerService {
  start(): Promise<void>;
  port?: string;
}
