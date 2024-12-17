/* eslint-disable no-unsafe-optional-chaining */

/* eslint-disable no-undef */
import { Link } from "reblend-router";
import imgLight from "../assets/img/illustrations/page-misc-error-light.png";
import Reblend from "reblendjs";
import { Container } from "react-bootstrap";
import fetcher from "../scripts/SharedFetcher";
import { PUBLIC_OPTIONS } from "../scripts/config/RestEndpoints";
import SharedConfig from "../scripts/SharedConfig";
import { SITE_TITLE } from "../scripts/config/contants";

export default class ErrorWrapper extends Reblend {
  static ELEMENT_NAME = "ErrorWrapper";
  constructor() {
    super();
  }
  _constructor() {
    super._constructor();
    this.state = { hasError: false, error: "An error just occured" };
  }

  componentDidMount() {
    /* fetcher.fetch(PUBLIC_OPTIONS).then((res) => {
      if (res?.data?.options) {
        for (const option of res?.data?.options) {
          SharedConfig.setSessionData(option.name, option.value);
        }
        document.title =
          (SharedConfig.getSessionData("SITE_TITLE") || SITE_TITLE) +
          (SharedConfig.getSessionData("SITE_TAGLINE")
            ? ` - ${SharedConfig.getSessionData("SITE_TAGLINE")}`
            : "");

        if (SharedConfig.getSessionData("SITE_DESCRIPTION")) {
          const metaDescription = document.createElement("meta");
          metaDescription.name = "description";
          metaDescription.content =
            SharedConfig.getSessionData("SITE_DESCRIPTION");

          const charsetMeta = document.querySelector('meta[charset="utf-8"]');
          if (charsetMeta) {
            charsetMeta.insertAdjacentElement("afterend", metaDescription);
          }
        }
      }
    }); */
  }

  renderingErrorHandler(error) {
    if (error) {
      this.setState({ hasError: true, error: error.message });
      console.error(error);
    }
  }

  html() {
    return this.state.hasError ? (
      <>
        <Container fluid>
          <div className="misc-wrapper">
            <h2 className="mb-2 mx-2">An Error has Occured</h2>
            <p className="mb-4 mx-2">{this.state.error}</p>
            <Link to="/" className="btn btn-primary">
              Back to home
            </Link>
            <div className="mt-3">
              <img
                src={imgLight}
                alt="Error"
                width="500"
                className="img-fluid"
                data-app-dark-img={imgLight}
                data-app-light-img={imgLight}
              />
            </div>
          </div>
        </Container>
      </>
    ) : (
      this.props.children
    );
  }
}
