import Reblend, { useContext, useEffect } from "reblendjs";
import { authTokenContext } from "../context";
import Router, { redirectTo, Route, usePageNotfound } from "reblend-router";
import { page } from "../components/Author/page";
import PageLayout from "../layouts/PageLayout";
import { toast } from "react-toastify";

function Author() {
  const [auth] = useContext(authTokenContext);
  const pageNotfound = usePageNotfound();

  useEffect(() => {
    if (pageNotfound) {
      redirectTo("/author");
    }
  }, [pageNotfound]);

  useEffect(() => {
    if (!auth) {
      toast.info("Login to continue");
      redirectTo("/login");
    }
  }, [auth]);

  return (
    <PageLayout>
      <link rel="stylesheet" href="/static/css/main.css" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      />
      <div class="py-5 my-2 mx-5">
        <Router>
          {Object.entries(page).map(([path, Component]) => (
            <Route path={"/author" + path} Component={Component} />
          ))}
        </Router>
      </div>
    </PageLayout>
  );
}

export default Author;
