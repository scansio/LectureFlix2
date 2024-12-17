import Reblend, { useContext, useEffect } from "reblendjs";
import AuthButton from "./AuthButton";
import { serverContext, versionContext } from "../context";

function SchemeContainer({
  servers,
  versions,
}: {
  servers: string[] | undefined;
  versions: string[] | undefined;
}) {
  const [currentVersion, setCurrentVersion] = useContext(versionContext);
  const [currentServer, setCurrentServer] = useContext(serverContext);

  useEffect(() => {
    if (!currentVersion && versions && versions.length) {
      setCurrentVersion(versions[0]);
    }
    if (!currentServer && servers && servers.length) {
      setCurrentServer(servers[0]);
    }
  }, [currentVersion, currentServer, servers, versions]);

  return (
    <div class="scheme-container">
      <section class="schemes wrapper block col-12">
        <div>
          <span class="servers-title">Versions</span>
          <div class="servers">
            <label for="servers">
              <select
                onChange={(e) => versionContext.update(e.target.value)}
                value={currentVersion}
              >
                <option value={""}>Select Version</option>
                {versions?.map((version) => (
                  <option value={version}>{version}</option>
                )) || []}
              </select>
            </label>
          </div>
        </div>

        <div>
          <span class="servers-title">Servers</span>
          <div class="servers">
            <label for="servers">
              <select
                onChange={(e) => serverContext.update(e.target.value)}
                value={currentServer}
              >
                <option value={""}>Select Server</option>
                {servers?.map((server) => (
                  <option value={server}>{server}</option>
                )) || []}
              </select>
            </label>
          </div>
        </div>
        <div class="auth-wrapper">
          <AuthButton fullButton />
        </div>
      </section>
    </div>
  );
}

export default SchemeContainer;
