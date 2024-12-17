import { IRoute } from './IRoute';

export interface IControllerRoute {
  schema: Object;
  routes: IRoute[];
  tag: string;
  baseUrl: string;
  description: string;
  externalDocs?: {
    description: string;
    url: string;
  };
}
