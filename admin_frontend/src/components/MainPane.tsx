import { useHash } from "reblend-router";
import { IControllerRoute } from "../interfaces/IControllerRoute";
import OperationBlock from "./OperationBlock";
import Reblend from "reblendjs";

const MainPane = ({
  controllerRoutes,
}: {
  controllerRoutes: IControllerRoute[] | undefined;
}) => {
  const hash = useHash();

  return [
    controllerRoutes?.find((controllerRoute) => {
      const tag = `${controllerRoute?.tag}`;
      const hashTag = `#${tag}-tag`;
      return hash === hashTag || hash?.split("#")[1] === tag;
    }),
  ].map((controllerRoute) => {
    if (!controllerRoute) {
      return null;
    }
    return <OperationBlock controllerRoute={controllerRoute} />;
  });
};

export default MainPane;
