import Reblend, { useEffect, useReducer, useState } from "reblendjs";
import Format from "./Format";
import { Link, useHash } from "reblend-router";

function Model({ model }: any) {
  const [showModel, setShowModel] = useState(false);

  const hashTag = `#${model?.tag}`;

  const hash = useHash();

  useEffect(() => {
    if (hashTag === hash) {
      setShowModel(true);
    } else {
      setShowModel(false);
    }
  }, [hash]);

  return (
    <div id={model.tag} class="model-container">
      <span class="models-jump-to-path"></span>
      <span class="model-box">
        <div class="model-box">
          <span class="model">
            <span class="">
              <Link
                href={`${(window as any).REBLEND_BASE_PATHNAME}/${hashTag}`}
              >
                <span class="model-title">
                  <span class="model-title__text">{model.tag}</span>
                </span>
              </Link>
              <Link
                href={`${(window as any).REBLEND_BASE_PATHNAME}/${hashTag}`}
              >
                <span
                  class={`model-toggle ${!showModel ? "collapsed" : ""}`}
                ></span>
              </Link>
              {showModel ? (
                <Format language="json" code={model.model} colored />
              ) : null}
            </span>
          </span>
        </div>
      </span>
    </div>
  );
}

export default Model;
