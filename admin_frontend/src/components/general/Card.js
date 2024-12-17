import Reblend from "reblendjs";
import { Card } from "react-bootstrap";

export function InnerCard({ props, Comp }) {
  return class extends Reblend {
    html() {
      return <Comp {...this.props} {...props} />;
    }
  };
}

export function OuterCard(props) {
  return <InnerCard Comp={Card} {...props} />;
}
