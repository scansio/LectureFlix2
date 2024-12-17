import Reblend, { SharedConfig } from "reblendjs";
import { authTokenContext } from "../context";

function Logout() {
  SharedConfig.destroyAll();
  authTokenContext.update("");
  //@ts-ignore
  window.location = "/";
  
  return <></>;
}

export default Logout;
