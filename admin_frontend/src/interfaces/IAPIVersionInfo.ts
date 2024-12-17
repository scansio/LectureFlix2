import { APIVersionStatus } from "./APIVersionStatus";

export default interface IAPIVersionInfo {
  title: string;
  description: string;
  version: string;
  servers: string[];
  status: APIVersionStatus;
  miscModel: { [key: string]: object };
}
