import Reblend from "reblendjs";
import PageLayout from "../layouts/PageLayout";
import { Container } from "react-bootstrap";

function Publisher() {
  return (
    <PageLayout>
      <Container>
        <h2
          className="font-xl center text-center"
          style={{ margin: "10px", fontWeight: 900, fontSize: '100px' }}
        >
          Under development
        </h2>
        <div className="font-xl center text-center">Publisher's page</div>
      </Container>
    </PageLayout>
  );
}

export default Publisher;
