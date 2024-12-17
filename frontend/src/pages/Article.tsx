import Reblend, { SharedConfig, useEffect, useState } from "reblendjs";
import PageLayout from "../layouts/PageLayout";
import ArticleHeading from "../components/Article/ArticleHeading";
import WrittenBy from "../components/Article/WrittenBy";
import CommentSection from "../components/Article/CommentSection/CommentSection";
import TagSection from "../components/Article/TagSection";
import MoreFromAuthor from "../components/Article/MoreFromAuthor/MoreFromAuthor";
import RelatedPost from "../components/Article/RelatedPost/RelatedPost";
import ArticleBlock from "../components/Article/ArticleBlock";
import { useParams } from "reblend-router";
import Notfound from "./Notfound";
import fetcher from "../scripts/SharedFetcher";
import { Card, Placeholder } from "react-bootstrap";
import { ARTICLE_SLUG, ARTICLE_READ } from "../scripts/config/RestEndpoints";
import { toast } from "react-toastify";
import { UID } from "../scripts/config/contants";
import IArticle from "../components/Article/IArticle";

function Article({ previewOfArticle }: { previewOfArticle?: IArticle }) {
  const params = useParams<{ slug: string }>();
  const [article, setArticle] = useState<IArticle | null>(
    previewOfArticle || null
  );
  const [articleNotfound, setArticleNotfound] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [, setArticleReloadingEffectTrigger] = useState(false);
  const [minuteSpend, setMinuteSpend] = useState(0);
  const [readToend, setReadToEnd] = useState(false);
  const [submittedRead, setSubmittedRead] = useState(false);

  function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setReadToEnd(true);
      window.removeEventListener("scroll", handleScroll);
    }
  }
  window.addEventListener("scroll", handleScroll);

  let intervalId: any = 0;
  const startReading = () => {
    intervalId = setInterval(() => {
      setMinuteSpend((prev) => prev++);
    }, 1000 * 60);
  };

  useEffect(() => {
    if (!previewOfArticle && params.slug) {
      setLoadingArticle(true);
      fetcher
        .fetch(ARTICLE_SLUG + params.slug)
        .then((data) => {
          if (data?.connection?.status) {
            setArticle(data.data);
            setTimeout(startReading);
          } else {
            setArticleNotfound(true);
            toast.error(data?.connection?.message || "Could not load article");
          }
          setLoadingArticle(false);
        })
        .catch((e) => {
          toast.error(e.message || "Could not load article");
          setLoadingArticle(false);
        });
    } else {
      setLoadingArticle(false);
    }

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line reblend-hooks/exhaustive-deps
  }, [params.slug, previewOfArticle]);

  useEffect(() => {
    if (
      !submittedRead &&
      article &&
      minuteSpend >= article.readingTimeInMinute &&
      readToend
    ) {
      fetcher
        .fetch({
          url: ARTICLE_READ,
          articleId: article._id,
          readingTimeInMinute: article.readingTimeInMinute,
          readToend,
          minuteSpend,
          readBy: SharedConfig.getLocalData(UID) || 0,
        })
        .then((data) => {
          if (data?.connection?.status) {
            setSubmittedRead(true);
          } else {
            console.error(
              "Error submitting reading data:",
              data?.connection?.message || "null"
            );
          }
        })
        .catch((error) => {
          console.error("Error submitting reading data:", error);
        });
    }
  }, [minuteSpend, article, readToend, submittedRead]);

  const readingView = () => (
    <div>
      <ArticleHeading article={article} />
      <div class="container mt-10">
        <div class="relative">
          <div class="nc-SingleContent space-y-10">
            {loadingArticle ? (
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={7} />
                <Placeholder xs={4} />
                <Placeholder xs={4} />
                <Placeholder xs={6} />
                <Placeholder xs={8} />
              </Placeholder>
            ) : (
              <>
                <ArticleBlock article={article!} />
                <TagSection />
                <div class="max-w-screen-md mx-auto border-b border-t border-neutral-100 dark:border-neutral-700"></div>
                <WrittenBy author={article?.author!} />
                <CommentSection
                  article={article as any}
                  setArticleReloadingEffectTrigger={
                    setArticleReloadingEffectTrigger
                  }
                />
              </>
            )}
          </div>
        </div>
      </div>
      <div class="relative bg-neutral-100 dark:bg-neutral-800 py-16 lg:py-28 mt-16 lg:mt-28">
        <div class="container">
          {loadingArticle ? (
            <Placeholder as={Card.Text} animation="glow">
              <Placeholder xs={7} />
              <Placeholder xs={4} />
              <Placeholder xs={4} />
              <Placeholder xs={6} />
              <Placeholder xs={8} />
            </Placeholder>
          ) : (
            <>
              <RelatedPost
                tag={article?.tags!}
                exludeArticleId={article?._id}
              />
              <MoreFromAuthor
                exludeArticleId={article?._id}
                uid={article?.author?._id!}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );

  return !(previewOfArticle || params.slug) || articleNotfound ? (
    <Notfound />
  ) : previewOfArticle ? (
    readingView()
  ) : (
    <PageLayout>{readingView()}</PageLayout>
  );
}

export default Article;
