import Reblend, { useContext, useEffect, useState } from "reblendjs";
import { authTokenContext } from "../context";
import { LOGIN } from "../utils/RestEndpoints";
import fetcher from "../utils/SharedFetcher";

function AuthForm({ onClose = () => {} }: any) {
  const [useAuthContext] = useContext(authTokenContext);
  const [auth, setAuth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (useAuthContext) {
      setAuth(useAuthContext);
    }
  }, [useAuthContext]);

  const authorize = async (e: Event) => {
    e.preventDefault();
    setErrMsg("");
    setLoading(true);
    const authData = { url: LOGIN, data: { email, password } };
    fetcher
      .fetch(authData)
      .then((data) => {
        if (data?.connection?.status) {
          authTokenContext.update(data.data || "");
          onClose();
        } else {
          setErrMsg(data?.connection?.message || "Error");
        }
        setLoading(false);
      })
      .catch((err) => (setErrMsg(err.message), setLoading(false)));
  };

  return (
    <div class="auth-container">
      <form onSubmit={authorize}>
        <div>
          <h4>
            <code>BearerAuth</code>&nbsp; (http, Bearer)
          </h4>
          <div class="wrapper">
            <label>Email:</label>
            <section class="">
              <input
                type="text"
                class="form-control"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                disabled={!!useAuthContext}
                required
              />
            </section>
          </div>
          <div class="wrapper">
            <label>Password:</label>
            <section class="">
              <input
                type="text"
                class="form-control"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                disabled={!!useAuthContext}
                required
              />
            </section>
          </div>
          <div class="wrapper error">{errMsg}</div>
        </div>
        <div class="auth-btn-wrapper">
          {useAuthContext ? (
            <button
              class="btn modal-btn auth btn-done button"
              onclick={(e: { preventDefault: () => void }) => {
                e.preventDefault();
                authTokenContext.update("");
              }}
            >
              Logout
            </button>
          ) : (
            <button type="submit" class="btn modal-btn auth authorize button">
              {loading ? "Loading" : "Authorize"}
            </button>
          )}
          <button class="btn modal-btn auth btn-done button" onclick={onClose}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthForm;
