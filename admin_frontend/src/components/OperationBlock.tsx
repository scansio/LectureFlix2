import Reblend, {
  useContext,
  useEffect,
  useReducer,
  useState,
} from "reblendjs";
import TagGroup from "./TagGroup";
import Wrapper from "./Wrapper";
import { IControllerRoute } from "../interfaces/IControllerRoute";
import { addModel, View, viewContext } from "../context";
import { CustomComponents } from "../CustomComponents";
import HistoryComponentsForm from "./historyComponents/HistoryComponents";
import { Container } from "react-bootstrap";

function OperationBlock({
  controllerRoute,
}: {
  controllerRoute: IControllerRoute | undefined;
}) {
  const [showAction, setShowAction] = useReducer((prev) => !prev, true);
  const [optional, setOptional] = useState<{ tag: any } | null>(null);
  const [view] = useContext(viewContext);

  useEffect(() => {
    if (controllerRoute) {
      addModel({
        model: JSON.stringify(controllerRoute?.schema),
        tag: controllerRoute?.tag,
      });
      setOptional({
        tag: CustomComponents[(controllerRoute?.tag || "") as any],
      });
    }
  }, [controllerRoute]);

  return (() => {
    switch (view) {
      case View.CUSTOM:
        return (
          optional && optional.tag && Reblend.construct(optional.tag, {}, ...[])
        );
        break;

      case View.HISTORY:
        return (
          <Container fluid>
            <HistoryComponentsForm controllerRoute={controllerRoute} />
          </Container>
        );
        break;

      case View.REST:
        return (
          <Wrapper style={{ width: "100%" }}>
            <span>
              <div class="opblock-tag-section">
                <h4
                  class="opblock-tag no-desc"
                  id={`${controllerRoute?.tag}-tag`}
                  data-tag={`${controllerRoute?.tag}`}
                  data-is-open="false"
                >
                  <span class="nostyle" onclick={setShowAction}>
                    <span>{controllerRoute?.tag}</span>
                  </span>

                  <small>
                    <div class="markdown">
                      <a
                        class="nostyle"
                        href={`/#${controllerRoute?.tag}-tag`}
                        onclick={setShowAction}
                      >
                        <p>{controllerRoute?.description}</p>
                      </a>
                    </div>
                  </small>
                  <div class="info__externaldocs">
                    <small>
                      {controllerRoute?.externalDocs ? (
                        <a
                          href={controllerRoute?.externalDocs.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="link"
                        >
                          {controllerRoute?.externalDocs.description}
                        </a>
                      ) : null}
                    </small>
                  </div>
                  <a
                    class="nostyle"
                    href={`/#${controllerRoute?.tag}-tag`}
                    onclick={setShowAction}
                  >
                    <button class="expand-operation" title="Expand operation">
                      <svg class="arrow" width="20" height="20">
                        <use
                          href={`#large-arrow${showAction ? "-down" : ""}`}
                          xlinkHref={`#large-arrow${showAction ? "-down" : ""}`}
                        ></use>
                      </svg>
                    </button>
                  </a>
                </h4>
                <noscript></noscript>
                {showAction
                  ? controllerRoute?.routes?.map((route) => (
                      <TagGroup route={route} tag={controllerRoute?.tag} />
                    ))
                  : null}
              </div>
            </span>
          </Wrapper>
        );
        break;

      default:
        break;
    }
  })();
}

export default OperationBlock;
