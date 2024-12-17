import { Card, Placeholder } from "react-bootstrap";
import Reblend, { IAny } from "reblendjs";

function ArticleBlock({ article }: { article: IAny }) {
  return !article?.content ? (
    <Placeholder as={Card.Title} animation="glow">
      <Placeholder xs={6} />
    </Placeholder>
  ) : (
    <div
      id="single-entry-content"
      class="prose lg:prose-lg !max-w-screen-md mx-auto dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: article?.content }}
    />
  );
}

export default ArticleBlock;
