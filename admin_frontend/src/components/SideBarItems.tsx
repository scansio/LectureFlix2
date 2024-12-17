import { Link, useHash } from "reblend-router";
import { IControllerRoute } from "../interfaces/IControllerRoute";
import Reblend, { useEffect } from "reblendjs";
import { addModel } from "../context";

const SideBarItems = ({
  controllerRoutes,
}: {
  controllerRoutes: IControllerRoute[] | undefined;
}) => {
  const hash = useHash();

  useEffect(() => {
    controllerRoutes?.map((controllerRoute) => {
      addModel({
        model: JSON.stringify(controllerRoute?.schema),
        tag: controllerRoute?.tag,
      });
    });
  }, []);

  return controllerRoutes?.map((controllerRoute) => {
    const tag = `${controllerRoute?.tag}`;
    const hashTag = `#${tag}-tag`;
    return (
      <Link
        id={`${tag}-tag`}
        href={`${(window as any).REBLEND_BASE_PATHNAME}/${hashTag}`}
        className={`${
          hash === hashTag || hash?.split("#")[1] === tag
            ? "active-sidebutton"
            : ""
        }`}
      >
        {tag}
      </Link>
    );
  });
};

export default SideBarItems;
