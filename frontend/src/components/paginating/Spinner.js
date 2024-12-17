/* eslint-disable require-jsdoc */
import Reblend from "reblendjs";
import { InputGroup, Spinner as BSpinner } from "react-bootstrap";

function Spinner(props) {
  return (() => {
    if (props.loadingError) {
      return (
        <InputGroup.Text className="fw-bold" style={{ width: "100%" }}>
          <span>{props.loadingErrorMessage || "Couldn't load data"} </span>
        </InputGroup.Text>
      );
    }

    if (props.loading) {
      return (
        <>
          <BSpinner size="sm" variant="primary" />
          {props.text || props.children}
        </>
      );
    }

    return props.text || props.children;
  })();
}

export default Spinner;
