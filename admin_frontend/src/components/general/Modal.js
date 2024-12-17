/* eslint-disable require-jsdoc */
import Reblend, { useEffect, useRef } from "reblendjs";
import { Button, Modal } from "react-bootstrap";

const ModalBox = (props) => {
  const cancelRef = useRef(null);

  useEffect(() => {
    cancelRef.current && cancelRef.current.focus();
  }, [props.show]);

  return (
    <Modal
      className={`modal-${props.size} modal-${props.type}`}
      size={props.size}
      animation={props.animation}
      scrollable={props.scrollable}
      fullscreen={props.fullscreen}
      centered={props.centered}
      show={props.show}
      onHide={props.onHide}
      keyboard={props.keyboard}
      autoFocus={props.autoFocus}
      backdrop={props.backdrop || false}
    >
      <Modal.Header
        className="justify-content-center"
        style={props.style}
        closeButton
      >
        {!props.noHeader ? (
          <div className="modal-profile">{props.header}</div>
        ) : null}
      </Modal.Header>
      <Modal.Body className={`${props.className || ""}`} style={props.style}>
        {props.children || props.body}
      </Modal.Body>
      {(props.control === undefined && props.noControl === undefined) ||
      props.control ||
      !props.noControl ? (
        <Modal.Footer style={{ ...(props.style || {}), margin: "1px" }}>
          <Button
            ref={cancelRef}
            className="btn btn-default"
            type="button"
            variant="link"
            onClick={() => props.onCancel && props.onCancel()}
          >
            {props.cancelText}
          </Button>
          {props.onAccept && (
            <Button
              className={`btn btn-outline-${props.type}`}
              type="button"
              variant={props.type}
              onClick={(e) => props.onAccept && props.onAccept()}
            >
              {props.acceptText}
            </Button>
          )}
        </Modal.Footer>
      ) : null}
    </Modal>
  );
};

ModalBox.props = {
  header: <i className="fa fa-bell" style={{ fontSize: "50px" }}></i>,
  body: <p>Success</p>,
  cancelText: "Cancel",
  acceptText: "Ok",
  show: true,
  control: true,
  type: "primary",
  size: "md",
  keyboard: true,
  autoFocus: false,
  animation: false,
  scrollable: false,
  // fullscreen: 'sm-down',
  centered: false,
};

export default ModalBox;
export { ModalBox as Modal };
