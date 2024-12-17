import Reblend, { useContext, useState } from "reblendjs";
import DialogUX from "./DialogUX";
import { authTokenContext } from "../context";
import AuthForm from "./AuthForm";

function AuthButton({ fullButton }: any) {
  const [show, setShow] = useState(false);
  const [auth] = useContext(authTokenContext);
  const close = () => setShow(false);
  const showDialog = () => setShow(true);

  return (
    <>
      {show ? (
        <DialogUX onClose={close} header={"Authorization"}>
          <AuthForm onClose={close} />
        </DialogUX>
      ) : null}
      {fullButton ? (
        <button
          onclick={showDialog}
          class={`btn authorize ${auth ? "locked" : "unlocked"}`}
        >
          <span>Authorize</span>
          <svg width="20" height="20">
            <use
              href={`#${auth ? "locked" : "unlocked"}`}
              xlink:href={`#${auth ? "locked" : "unlocked"}`}
            ></use>
          </svg>
        </button>
      ) : (
        <button
          onclick={showDialog}
          class={`authorization__btn ${auth ? "locked" : "unlocked"}`}
          aria-label={`authorization button ${auth ? "locked" : "unlocked"}`}
        >
          <svg width="20" height="20">
            <use
              href={`#${auth ? "locked" : "unlocked"}`}
              xlink:href={`#${auth ? "locked" : "unlocked"}`}
            ></use>
          </svg>
        </button>
      )}
    </>
  );
}

export default AuthButton;
