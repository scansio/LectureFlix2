import { APIVersionStatus } from './APIVersionStatus';
import IAPIVersionInfo from './IAPIVersionInfo';
import { IControllerRoute } from './IControllerRoute';

export type Version = {
  info: IAPIVersionInfo;
  controllerRoutes: IControllerRoute[];
  status: APIVersionStatus;
};

export type IAPI = Version[];
