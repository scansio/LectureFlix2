import Reblend from "reblendjs";
import PageLayout from "../layouts/PageLayout";
import Newsletter from "../components/Home/Newsletter/Newsletter";
import LatestArticles from "../components/Home/LatestArticles/LatestArticles";
//import TopAuthors from "../components/Home/TopAuthors/TopAuthors";
import BecomeAuthor from "../components/Home/BecomeAuthor/BecomeAuthor";
import EditorsPick from "../components/Home/EditorsPick/EditorsPick";

function Home() {
  return (
    <PageLayout>
      <div class="nc-PageHome relative" >
        <EditorsPick />
        <div class="container " >
          {/* <TopAuthors /> */}
          <BecomeAuthor />
          <Newsletter />
          <hr />
          <LatestArticles />
        </div>
      </div>
    </PageLayout>
  );
}

export default Home;
