import Reblend, {
  IAny,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "reblendjs";
import ServerResponse from "./ServerResponse";
import SampleResponse from "./SampleResponse";
import axios, { AxiosError, AxiosResponse } from "axios";
import { IRoute } from "../interfaces/IRoute";
import { serverContext, versionContext } from "../context";
import Format from "./Format";

type IParam = {
  [key: string]: { [k: string]: any };
};

type IParamSetOption = { param: string; ident: string; value: any };

function ActionPane({
  tag,
  authToken,
  route,
}: {
  authToken: string;
  tag: string;
  route: IRoute | undefined;
}) {
  const [tryItOut, setTryItOut] = useReducer((pre: boolean) => !pre, false);
  const [parameter, setParameter] = useReducer<IParam, IParamSetOption>(
    (p, cur) => {
      const ret = { ...p };
      if (!ret[cur.param]) {
        ret[cur.param] = {};
      }
      ret[cur.param][cur.ident] = cur.value;
      return ret;
    },
    {}
  );

  const [body, setBody] = useState("");
  const [isBodyAvailable, setIsBodyAvailable] = useState(
    !!route?.validation?.body
  );
  delete route?.validation?.body;

  const [url, setUrl] = useState("");
  const [requestHeadersString, setRequestHeadersString] = useState("");
  const [currentServer] = useContext(serverContext);
  const [currentApiVersion] = useContext(versionContext);
  const paths = useMemo(
    () =>
      route?.path.split("/").map((splittedPath) => {
        if (!splittedPath.startsWith(":")) {
          return splittedPath;
        } else {
          const _p = splittedPath.match(/^:(\w+)/);
          return _p?.[0];
        }
      }),
    [route?.path]
  );

  useEffect(() => {
    let p = [...(paths || [])];
    let q: string[] = [];
    Object.entries(parameter.param || {}).forEach(([key, value]) => {
      const pIndex = p.indexOf(`:${key}`);
      if (pIndex > -1) {
        p[pIndex] = value;
      }
    });
    Object.entries(parameter.query || {}).forEach(([key, value]) =>
      q.push(`${key}=${value}`)
    );
    let u = `${currentServer}${!currentServer || currentServer.endsWith("/") ? "" : "/"}${currentApiVersion}${p.filter((pPath) => !pPath?.startsWith(":")).join("/")}${q && q.length > 0 ? "?" + q.join("&") : ""}`;
    setUrl(u);
  }, [parameter, route?.path, currentServer, currentApiVersion, paths]);

  const temp = `
{
  "type": "Sample",
  "title": "Api documentaion ui",
  "author": "Emmanuel Paul Elom <scansioquielom@gmail.com>"
}`;

  const [selectedSampleRequest, setSelectedSampleRequest] = useReducer(
    (_pre, curr) => {
      return (curr as string) || temp;
    },
    (route?.metadata?.sampleRequests &&
      route?.metadata?.sampleRequests![0].statusCode) ||
      temp
  );

  const [res, setRes] = useState<AxiosResponse | undefined | null>(null as any);
  const [executing, setExecuting] = useState(false);
  const [validBodyMsg, setValidBodyMsg] = useState("");
  const [codeds, setCodeds] = useState<IAny>({});

  function execute(e: Event) {
    e.preventDefault();
    setExecuting(true);
    setValidBodyMsg("");
    const headers = {
      ...parameter?.headers,
      ...(route?.requireAuthentication ? { Authorization: authToken } : {}),
    };
    setRequestHeadersString(JSON.stringify(headers));
    const opt = {
      url,
      method: route?.method,
      data: undefined,
      headers: headers,
    };
    try {
      route?.method === "post" && body && (opt.data = JSON.parse(body));
    } catch (error) {
      setValidBodyMsg((error as any).message);
      setExecuting(false);
      return;
    }
    axios(opt)
      .then(setRes)
      .catch((err: AxiosError) => {
        setRes(err.response || ({ data: err.message } as any));
      })
      .finally(() => setExecuting(false));
  }

  function toggleQueryCoding({
    param,
    name,
    type,
  }: {
    param: string;
    name: string;
    type: string;
  }) {
    const paramValue = (parameter[param] || {})[name];
    if (paramValue) {
      let encoded;
      try {
        encoded =
          type === "encode"
            ? btoa(parameter[param][name])
            : atob(parameter[param][name]);
      } catch (error) {}
      if (encoded) {
        const codedsName = `${param}.${name}`;
        setParameter({ param, ident: name, value: encoded } as any);
        setCodeds({ ...codeds, [codedsName]: !codeds[codedsName] });
      }
    }
  }

  return (
    <div style="height: auto; border: none; margin: 0px; padding: 0px;">
      <div class="opblock-body">
        <div class="opblock-section">
          <div class="opblock-section-header">
            <div class="tab-header">
              <div class="tab-item active">
                <h4 class="opblock-title">
                  <span>Parameters</span>
                </h4>
              </div>
            </div>
            <div class="try-out">
              <button class="btn try-out__btn cancel" onclick={setTryItOut}>
                {tryItOut ? "Cancel" : "Try it out"}
              </button>
            </div>
          </div>

          <div class="parameters-container">
            <div class="opblock-description-wrapper">
              <div class="table-container">
                <table class="parameters">
                  <thead>
                    <tr>
                      <th class="col col_header parameters-col_name">Name</th>
                      <th class="col col_header parameters-col_description">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {route?.validation &&
                      Object.entries(route?.validation).map(
                        ([param, option]) => {
                          return Object.entries(option).map(
                            ([name, validationOption]) => {
                              return (
                                <tr
                                  data-param-name={name}
                                  data-param-in={param}
                                >
                                  <td class="col parameters-col_name">
                                    <div class="parameter__name">
                                      {name}
                                      {/* <span style="color: red;">&nbsp;*</span> */}
                                    </div>
                                    {/* <div class="parameter__type">string</div>
                          <div class="parameter__deprecated"></div> */}
                                    <div class="parameter__in">({param})</div>
                                  </td>
                                  <td class="col parameters-col_description">
                                    {param === "query" ? (
                                      <textarea
                                        class="form-control"
                                        placeholder={name}
                                        value={
                                          (parameter[param] || {})[name] || ""
                                        }
                                        oninput={(e: any) =>
                                          setParameter({
                                            param,
                                            ident: name,
                                            value: e.target.value,
                                          } as any)
                                        }
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        class="form-control"
                                        placeholder={name}
                                        value={
                                          (parameter[param] || {})[name] || ""
                                        }
                                        onInput={(e: any) =>
                                          setParameter({
                                            param,
                                            ident: name,
                                            value: e.target.value,
                                          } as any)
                                        }
                                      />
                                    )}
                                    {param === "query" ? (
                                      <span>
                                        <span
                                          class="try-out"
                                          style="padding-left: 5px;"
                                        >
                                          <button
                                            class="btn try-out__btn primary"
                                            onclick={() =>
                                              toggleQueryCoding({
                                                param,
                                                name,
                                                type: "encode",
                                              })
                                            }
                                            disabled={
                                              codeds[`${param}.${name}`]
                                            }
                                          >
                                            Encode
                                          </button>
                                        </span>
                                        <span
                                          class="try-out"
                                          style="padding-left: 5px;"
                                        >
                                          <button
                                            class="btn try-out__btn primary"
                                            onclick={() =>
                                              toggleQueryCoding({
                                                param,
                                                name,
                                                type: "decode",
                                              })
                                            }
                                            disabled={
                                              !codeds[`${param}.${name}`]
                                            }
                                          >
                                            Decode
                                          </button>
                                        </span>
                                      </span>
                                    ) : null}
                                    <br />
                                    {Object.keys(validationOption as any).map(
                                      (v) => (
                                        <span>&nbsp; {v} &nbsp;</span>
                                      )
                                    )}
                                  </td>
                                </tr>
                              );
                            }
                          );
                        }
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="opblock-section opblock-section-request-body">
            <div class="opblock-section-header">
              <h4 class="opblock-title parameter__name">Request body</h4>
              {/* <label>
                <div class="content-type-wrapper body-param-content-type">
                  <select class="content-type">
                    <option value="application/json">application/json</option>
                  </select>
                </div>
              </label> */}
              {tryItOut && !isBodyAvailable ? (
                <div class="try-out">
                  <button
                    class="btn try-out__btn primary"
                    onclick={() => setIsBodyAvailable(true)}
                  >
                    Add body
                  </button>
                </div>
              ) : null}
            </div>
            <div class="opblock-description-wrapper">
              <div>
                <div class="examples-select">
                  <span class="examples-select__section-label">Examples: </span>
                  <select
                    onInput={(e: any) =>
                      setSelectedSampleRequest(e.target.value)
                    }
                    value={selectedSampleRequest}
                  >
                    {route?.metadata?.sampleRequests &&
                      route?.metadata?.sampleRequests.map((sample) => (
                        <option value={sample.content}>
                          {sample.description}
                        </option>
                      ))}
                  </select>
                </div>
                <ul class="tab">
                  <li class="tabitem active">
                    <a class="tablinks" data-name="example" href="#example">
                      {!tryItOut ? "Example" : "Edit"} Value
                    </a>
                  </li>
                  <li class="tabitem">
                    <a class="tablinks" data-name="model" href={`#${tag}`}>
                      Schema
                    </a>
                  </li>
                </ul>
                <div>
                  {isBodyAvailable ? (
                    <div class="body-param">
                      {tryItOut ? (
                        <>
                          <textarea
                            class="body-param__text"
                            value={selectedSampleRequest}
                            onChange={(e) => setBody(e.target.value)}
                          ></textarea>
                          <p class="cancel">{validBodyMsg}</p>
                        </>
                      ) : (
                        <Format language="json" code={selectedSampleRequest} />
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        {tryItOut ? (
          <div class="execute-wrapper">
            <div class="btn-group">
              <button
                class="btn execute opblock-control__btn"
                onclick={execute}
                disabled={executing}
                title={executing ? "Executing please wait ..." : ""}
              >
                Execute
              </button>
              {res ? (
                <button
                  onclick={() => setRes(null as any)}
                  class="btn btn-clear opblock-control__btn"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
        <div class="responses-wrapper">
          <div class="opblock-section-header">
            <h4>Responses</h4>
          </div>
          <div class="responses-inner">
            <div>
              <div class="request-url">
                <h4>Request URL</h4>
                <pre>{url}</pre>
              </div>
            </div>
            <div>
              <div class="request-url">
                <h4>Request Headers</h4>
                <pre>{requestHeadersString}</pre>
              </div>
            </div>
            {res && <ServerResponse response={res} />}
            {route?.metadata?.sampleResponses && (
              <SampleResponse samples={route?.metadata.sampleResponses} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActionPane;
