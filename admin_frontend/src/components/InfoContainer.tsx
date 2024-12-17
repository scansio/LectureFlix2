import Reblend, { useContext, useEffect } from "reblendjs";
import Wrapper from "./Wrapper";
import SchemeContainer from "./SchemeContainer";
import IAPIVersionInfo from "../interfaces/IAPIVersionInfo";
import { addModel, versionContext } from "../context";

function InfoContainer({
  versions,
  info,
}: {
  versions: string[];
  info: IAPIVersionInfo | undefined;
}) {
  const [currentApiVersion] = useContext(versionContext);

  useEffect(() => {
    if (info && info.miscModel) {
      for (const [key, model] of Object.entries(info.miscModel)) {
        addModel({
          model: JSON.stringify(model),
          tag: key,
        });
      }
    }
  }, [info, currentApiVersion]);

  return (
    <>
      <Wrapper className="information-container">
        <section class="block col-12">
          <div
            style={{
              display: "flex",
              alignContent: "flex-end",
              justifyContent: "space-around",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div class="info">
              <hgroup class="main">
                <h2 class="title">
                  {info?.title}
                  {currentApiVersion && (
                    <span>
                      <small>
                        <pre class="version"> {currentApiVersion} </pre>
                      </small>
                    </span>
                  )}
                </h2>
                {/* <a
                  target="_blank"
                  href="/main/api-docs"
                  rel="noopener noreferrer"
                  class="link"
                >
                  <span class="url">/main/api-docs</span>
                </a> */}
              </hgroup>
              <div class="description">
                <div class="renderedMarkdown">
                  <p>{info?.description}</p>
                </div>
              </div>
            </div>
            <h1 class="text-center">Admin Portal</h1>
          </div>
        </section>
      </Wrapper>
      <SchemeContainer versions={versions} servers={info?.servers} />
    </>
  );
}

export default InfoContainer;
