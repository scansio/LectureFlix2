/* eslint-disable no-undef */

import Reblend, { useEffect, useRef } from "reblendjs";
import { Link } from "reblend-router";

function DockerButton({ active, path, name, icon, scroll }) {
  let anchorRef = useRef(null);
  async function s() {
    return new Promise((resolve, reject) => {
      anchorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
      setTimeout(() => {
        return resolve();
      }, 1000);
    });
  }
  useEffect(() => {
    if (active !== "") {
      s().then(
        (msg) => (document.documentElement.scrollTop = 0),
        (msg) => console.log(msg)
      );
    }
  }, [active]);

  return (
    <Link to={path} className={`btn ${active}`} ref={anchorRef}>
      <i className={`text-center ${icon} fa-lg`} />
      <div className=" text-nowrap" data-i18n={`${name}`}>
        {name}
      </div>
    </Link>
  );
}

export default DockerButton;
