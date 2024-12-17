/* eslint-disable no-undef */
import Reblend from "reblendjs";

import { Card, Col, Container, Nav, NavItem, Row } from "react-bootstrap";
import { Link, useLocation } from "reblend-router";
import OptionTab from "../components/tabs/option/OptionTab";

function Option() {
  const location = useLocation();
  const tab = new URLSearchParams(location?.search)?.get("tab");

  return (
    <Container fluid>
      <Row>
        <Col xs="12" className="mt-3">
          <Card>
            <Card.Body>{<OptionTab />}</Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default Option;
