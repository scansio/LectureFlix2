import Reblend from "reblendjs";
import PageLayout from "../layouts/PageLayout";
import RelatedPost from "../components/Article/RelatedPost/RelatedPost";
import { useParams } from "reblend-router";

function RelatedPostByTag() {
  const params = useParams<{ tagName: string }>();

  return (
    <PageLayout>
      <div class="container my-10">
        <RelatedPost tag={params.tagName} />
      </div>
    </PageLayout>
  );
}

export default RelatedPostByTag;
