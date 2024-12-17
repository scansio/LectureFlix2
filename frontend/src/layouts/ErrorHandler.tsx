import Reblend from "reblendjs";
import PageLayout from "./PageLayout";
import { Link } from "reblend-router";

class ErrorHandler extends Reblend<
  { children: JSX.Element | JSX.Element[] },
  { errorMessage: string }
> {
  static ELEMENT_NAME: string = "ErrorHandler";

  _constructor() {
    super._constructor();
    this.renderingErrorHandler = (error) => {
      console.log(error.component.displayName, ": ", error);
      this.setState({ errorMessage: error?.message || "" });
    };
  }

  html() {
    return this.state.errorMessage ? (
      <>
        <style>
          {`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Consolas", monospace;
}
:root {
  --bgcolor-dark: #1b1818;
  --text-clr-dark: #fff;
  --icon-clor: #18d1d1;
}
header {
  width: 100%;
  background: var(--bgcolor-dark);
  display: flex;
  align-items: center;
  justify-content: center;
}
.main-container {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row-reverse;
}
.icon-container {
  color: var(--icon-clor);
  font-size: 200px;
}
.text-container {
  color: var(--text-clr-dark);
  text-align: center;
}
.text-container h2 {
  font-size: 60px;
  line-height: normal;
  font-style: italic;
  font-weight: 600;
}
.text-container p {
  max-width: 500px;
}
.text-container span {
  color: var(--icon-clor);
}
.btn-container {
  margin-top: 20px;
  padding-top: 20px;  
}
.btn {
  color: var(--bgcolor-dark);
  padding: 10px;
  border: none;
  background: var(--icon-clor);
  border-radius: 10px;
  font-weight: 530;
  font-size: 15px;
  cursor: pointer;
}
.btn:hover {
  opacity: 0.7;
}
.btn:active {
  opacity: 0.5;
}
@media only screen and (max-width: 800px) {
  .container {
    flex-direction: column;
  }
  .text-container h2 {
    font-size: 50px;
  }
}
@media only screen and (prefers-color-scheme: light) {
  :root {
    --bgcolor-dark: #f3eaea;
    --text-clr-dark: #111;
    --icon-clor: #0099ff;
  }
}
`}
        </style>
        <header>
          <div class="main-container">
            <div class="icon-container">
              <i class="far fa-frown-open"></i>
            </div>
            <div class="text-container">
              <h2>
                Some <span>Error</span> occured!
              </h2>
              <div class="btn-container">
                <Link to="/" className="btn">
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </header>
      </>
    ) : (
      this.props.children
    );
  }
}

export default ErrorHandler;
