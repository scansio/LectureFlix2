import Reblend from "reblendjs";
import PageLayout from "../layouts/PageLayout";
import { Link, usePageNotfound } from "reblend-router";

function Notfound() {
  const pageNotfound = usePageNotfound();

  return pageNotfound ? (
    <PageLayout>
      <style>
        {`
      @import url('https://fonts.googleapis.com/css?family=Alfa+Slab+One|Josefin+Slab');

body {
  background-color: #aeb6bf;
}
@keyframes darken {
  0%{ font-size: 100px;  color:#566573;}
  50%{font-size: 200px; color:#273746}
  100% {font-size: 250px; color:#17202a}
}
  

h1 {
  font-family: 'Alfa Slab One', cursive;
  margin: 0 auto;
  inline: block;
  text-align: center;
  animation-name: darken;
  animation-duration: 5s;
  animation-iteration-count: infinite;
}

h3 {
  font-family: 'Josefin Slab', serif;
  margin: 0 auto;
  inline: block;
  text-align: center;
  font-size: 30px;
}`}
      </style>
      <div
        class="container d-flex"
        style={{
          display: "flex",
          height: "50vh",
          flexWrap: "wrap",
          alignContent: "space-around",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>404</h1>
        <h3>The page you are looking for cannot be found</h3>
        <hr />
        <div class="nc-Button flex-shrink-0 relative h-auto inline-flex items-center justify-center rounded-full transition-colors border-transparent bg-primary-700 hover:bg-primary-6000 text-primary-50 text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6 ">
          <Link to="/" className="btn">
            Go Home
          </Link>
        </div>
      </div>
    </PageLayout>
  ) : null;
}

export default Notfound;
