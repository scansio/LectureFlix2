import { IPathMethodMetadata } from './IPathMethodMetadata';

export interface IMethods {
  get?: IPathMethodMetadata;
  post?: IPathMethodMetadata;
  patch?: IPathMethodMetadata;
  delete?: IPathMethodMetadata;
}
