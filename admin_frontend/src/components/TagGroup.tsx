import Reblend, { useContext, useReducer } from "reblendjs";
import { IRoute } from "../interfaces/IRoute";
import ActionPane from "./ActionPane";
import { authTokenContext } from "../context";
import AuthButton from "./AuthButton";

function TagGroup({ route, tag }: { route: IRoute; tag: string }) {
  const [showAction, setShowAction] = useReducer((prev) => !prev, false);
  const [authToken] = useContext(authTokenContext);

  return (
    <div style="height: auto; border: none; margin: 0px; padding: 0px;">
      <span>
        <div class={`opblock opblock-${route.method}`} id="operations-k">
          <div class={`opblock-summary opblock-summary-${route.method}`}>
            <span class="opblock-summary-method" onclick={setShowAction}>
              {route.method.toUpperCase()}
            </span>
            <span
              class="opblock-summary-path"
              data-path="/users"
              onclick={setShowAction}
            >
              <span class="nostyle">
                <span>{route.path}</span>
              </span>
            </span>
            <div class="opblock-summary-description" onclick={setShowAction}>
              {route.metadata.summary}
            </div>
            {route.requireAuthentication ? <AuthButton /> : null}
          </div>
          <noscript></noscript>
          {showAction ? (
            <ActionPane authToken={authToken} tag={tag} route={route} />
          ) : null}
        </div>
      </span>
    </div>
  );
}

export default TagGroup;
