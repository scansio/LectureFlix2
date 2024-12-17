import Reblend, { useRef, useEffect, useState } from "reblendjs";
import { toast } from "react-toastify";
import ClickCopy, { clipCopy } from "../general/ClickCopy";
import { Button } from "react-bootstrap";
import ModalBox from "../general/Modal";

function DoubleClickCopy(props) {
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    msg && toast.dark(msg);
  }, [msg]);

  return (
    <>
      <span
        onClick={
          !props.noClickOpen
            ? (e) => {
                setOpen(true);
                e.stopPropagation();
              }
            : undefined
        }
        onDoubleClick={(e) => {
          clipCopy(props.children, setMsg);
          e.stopPropagation();
        }}
        className="c-pointer"
        title="Double click to copy the content"
      >
        {props.children}
      </span>
      <ModalBox
        show={open}
        onCancel={() => setOpen(false)}
        noControl
        noHeader
        backdrop
      >
        <div className="s-300h" style={{ overflow: "auto", zIndex: -1 }}>
          <div dangerouslySetInnerHTML={{ __html: props.children }}></div>
        </div>
        <div>
          <Button variant="outline-info">
            <ClickCopy text={props.children} />
          </Button>
        </div>
      </ModalBox>
    </>
  );
}

export default DoubleClickCopy;
