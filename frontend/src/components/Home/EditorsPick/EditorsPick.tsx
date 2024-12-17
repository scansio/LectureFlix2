import Reblend, { useEffect, useState } from "reblendjs";
import { ACTIVE } from "../../../scripts/config/contants";
import { ALL_ARTICLE, BASE } from "../../../scripts/config/RestEndpoints";
import fetcher from "../../../scripts/SharedFetcher";
import { paginatingUrl } from "../../../scripts/misc";
import { Card, Placeholder } from "react-bootstrap";

enum SelectionMovement {
  PREVIOUS,
  NEXT,
}

function EditorsPick() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<
    {
      slug: string;
      coverImageUrl: string;
      seoDescription: string;
      title: string;
      likeByIds: number[];
      numComments: number;
      tags: string[];
      author: {
        firstname: string;
        lastname: string;
        slug: string;
        avatar: string;
      };
      createdAt: {
        dateString: string;
      };
    }[]
  >([]);
  const [currentArticlePosition, setCurrentArticlePosition] = useState(0);
  const [loadingError, setLoadingError] = useState("");

  function select(selection: SelectionMovement) {
    if (articles?.length) {
      switch (selection) {
        case SelectionMovement.PREVIOUS:
          currentArticlePosition && setCurrentArticlePosition((prev) => prev--);
          break;

        case SelectionMovement.NEXT:
          if (currentArticlePosition + 1 === articles.length) {
            setCurrentArticlePosition(0);
          } else {
            setCurrentArticlePosition((prev) => prev++);
          }
          break;

        default:
          break;
      }
    }
  }

  useEffect(() => {
    setLoading(true);
    fetcher
      .fetch(
        paginatingUrl(ALL_ARTICLE, {
          populate: ["author"],
          $sort: { readers: -1 },
          published: true,
          status: ACTIVE,
        })
      )
      .then((data) => {
        if (data?.connection?.status) {
          setArticles(data?.data?.results || []);
          setLoadingError("");
        } else {
          setLoadingError(data?.connection?.message || "Error");
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setLoadingError(e.message);
      });
  }, []);

  return (
    <div class="container relative">
      {loading || loadingError || !articles?.length ? (
        <Placeholder as={Card.Title} animation="glow">
          <Placeholder xs={6}>
            {!loading && !loadingError && !articles?.length
              ? "No Editor's pick at this moment"
              : loadingError}
          </Placeholder>
        </Placeholder>
      ) : (
        <>
          <div class="nc-SectionLargeSlider relative pt-10 pb-16 md:py-16 lg:pb-28 lg:pt-20">
            <div class="nc-Section-Heading relative flex flex-col sm:flex-row sm:items-end justify-between mb-10 md:mb-12 text-neutral-900 dark:text-neutral-50">
              <div class="max-w-2xl">
                <h2 class="text-2xl md:text-3xl lg:text-4xl font-semibold">
                  Editor's pick
                </h2>
                <span class="mt-2 md:mt-3 font-normal block text-base sm:text-xl text-neutral-500 dark:text-neutral-400">
                  Discover the most outstanding articles in all topics of life.{" "}
                </span>
              </div>
            </div>
            <div class="nc-CardLarge1 nc-CardLarge1--hasAnimation relative flex flex-col-reverse md:flex-row justify-end ">
              <div class="md:absolute z-10 md:left-0 md:top-1/2 md:-translate-y-1/2 w-full -mt-8 md:mt-0 px-3 sm:px-6 md:px-0 md:w-3/5 lg:w-1/2 xl:w-2/5">
                <div class="nc-CardLarge1__left p-4 sm:p-8 xl:py-14 md:px-10 bg-white/40 dark:bg-neutral-900/40 backdrop-filter backdrop-blur-lg shadow-lg dark:shadow-2xl rounded-3xl space-y-3 sm:space-y-5 ">
                  <div
                    class="nc-CategoryBadgeList flex flex-wrap space-x-2"
                    data-nc-id="CategoryBadgeList"
                  >
                    {articles[currentArticlePosition].tags?.map((tag) => (
                      <a
                        class="transition-colors hover:text-white duration-300 nc-Badge  inline-flex px-2.5 py-1 rounded-full font-medium text-xs relative text-yellow-800 bg-yellow-100 hover:bg-yellow-800"
                        href={(window as any).REBLEND_BASE_PATHNAME + "/tag/" + tag}
                      >
                        {tag}
                      </a>
                    ))}
                  </div>
                  <h2 class="nc-card-title text-base sm:text-xl lg:text-2xl font-semibold ">
                    <a
                      class="line-clamp-2"
                      title={articles[currentArticlePosition].seoDescription}
                      href={(window as any).REBLEND_BASE_PATHNAME + "/article/" + articles[currentArticlePosition].slug}
                    >
                      {articles[currentArticlePosition].title}
                    </a>
                  </h2>
                  <a
                    class="nc-CardAuthor2 relative inline-flex items-center relative"
                    href={(window as any).REBLEND_BASE_PATHNAME + 
                      "/publisher/" +
                      articles[currentArticlePosition].author.slug
                    }
                  >
                    <div class="wil-avatar relative flex-shrink-0 inline-flex items-center justify-center overflow-hidden text-neutral-100 uppercase font-semibold shadow-inner rounded-full h-10 w-10 text-base flex-shrink-0 mr-3">
                      <img
                        sizes="100px"
                        src={(window as any).REBLEND_BASE_PATHNAME + 
                          BASE +
                            articles[currentArticlePosition].author.avatar ||
                          "/static/media/face.jpeg"
                        }
                        class="absolute inset-0 w-full h-full object-cover object-cover absolute inset-0 w-full h-full"
                        alt={
                          articles[currentArticlePosition].author.firstname +
                          " " +
                          articles[currentArticlePosition].author.lastname
                        }
                      />
                      <span class="wil-avatar__name">F</span>
                    </div>
                    <div>
                      <h2 class="text-sm text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white font-medium">
                        {articles[currentArticlePosition].author.firstname +
                          " " +
                          articles[currentArticlePosition].author.lastname}
                      </h2>
                      <span class="flex items-center mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        <span>
                          {
                            articles[currentArticlePosition].createdAt
                              .dateString
                          }
                        </span>
                      </span>
                    </div>
                  </a>
                  <div class="flex items-center justify-between mt-auto">
                    <div class="nc-PostCardLikeAndComment flex items-center space-x-2 ">
                      <a
                        class="nc-PostCardLikeAction relative min-w-[68px] flex items-center rounded-full leading-none group transition-colors px-3 h-8 text-xs text-neutral-700 bg-neutral-50 dark:text-neutral-200 dark:bg-neutral-800 hover:bg-rose-50 dark:hover:bg-rose-100 hover:text-rose-600 dark:hover:text-rose-500"
                        title="Likes"
                        href={(window as any).REBLEND_BASE_PATHNAME + 
                          "/article/" +
                          articles[currentArticlePosition].slug +
                          "/#likes"
                        }
                      >
                        <svg
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill-rule="evenodd"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1"
                            d="M11.995 7.23319C10.5455 5.60999 8.12832 5.17335 6.31215 6.65972C4.49599 8.14609 4.2403 10.6312 5.66654 12.3892L11.995 18.25L18.3235 12.3892C19.7498 10.6312 19.5253 8.13046 17.6779 6.65972C15.8305 5.18899 13.4446 5.60999 11.995 7.23319Z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <span class="ml-1 text-neutral-900 dark:text-neutral-200">
                          {articles[currentArticlePosition].likeByIds?.length ||
                            0}
                        </span>
                      </a>
                      <a
                        class="nc-PostCardCommentBtn relative items-center min-w-[68px] rounded-full text-neutral-6000 bg-neutral-50 transition-colors dark:text-neutral-200 dark:bg-neutral-800 hover:bg-teal-50 dark:hover:bg-teal-100 hover:text-teal-600 dark:hover:text-teal-500 hidden sm:flex  px-3 h-8 text-xs "
                        title="Comments"
                        href={(window as any).REBLEND_BASE_PATHNAME + 
                          "/article/" +
                          articles[currentArticlePosition].slug +
                          "/#comments"
                        }
                      >
                        <svg
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1"
                            d="M4.75 6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H17.25C18.3546 4.75 19.25 5.64543 19.25 6.75V14.25C19.25 15.3546 18.3546 16.25 17.25 16.25H14.625L12 19.25L9.375 16.25H6.75C5.64543 16.25 4.75 15.3546 4.75 14.25V6.75Z"
                          ></path>
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9.5 11C9.5 11.2761 9.27614 11.5 9 11.5C8.72386 11.5 8.5 11.2761 8.5 11C8.5 10.7239 8.72386 10.5 9 10.5C9.27614 10.5 9.5 10.7239 9.5 11Z"
                          ></path>
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12.5 11C12.5 11.2761 12.2761 11.5 12 11.5C11.7239 11.5 11.5 11.2761 11.5 11C11.5 10.7239 11.7239 10.5 12 10.5C12.2761 10.5 12.5 10.7239 12.5 11Z"
                          ></path>
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.5 11C15.5 11.2761 15.2761 11.5 15 11.5C14.7239 11.5 14.5 11.2761 14.5 11C14.5 10.7239 14.7239 10.5 15 10.5C15.2761 10.5 15.5 10.7239 15.5 11Z"
                          ></path>
                        </svg>
                        <span class="ml-1 text-neutral-900 dark:text-neutral-200">
                          {articles[currentArticlePosition].numComments}
                        </span>
                      </a>
                    </div>
                    {/* <div class="nc-PostCardSaveAction flex items-center space-x-2 text-xs text-neutral-700 dark:text-neutral-300 ">
                      <button
                        class="nc-NcBookmark relative rounded-full flex items-center justify-center h-8 w-8 bg-neutral-50/30 hover:bg-neutral-50/50 dark:bg-neutral-800/30 dark:hover:bg-neutral-800/50"
                        title="Save to reading list"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          fill="none"
                          stroke="currentColor"
                          class="w-[18px] h-[18px]"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                          ></path>
                        </svg>
                      </button>
                    </div> */}
                  </div>
                </div>
                <div class="p-4 sm:pt-8 sm:px-10">
                  <div
                    class="nc-NextPrev relative flex items-center text-slate-500 dark:text-slate-400 "
                    data-nc-id="NextPrev"
                    data-glide-el="controls"
                  >
                    <button
                      class="w-11 h-11 text-xl mr-2 border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center "
                      title="Prev"
                      data-glide-dir="<"
                      onClick={() => select(SelectionMovement.PREVIOUS)}
                    >
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M9.57 5.92993L3.5 11.9999L9.57 18.0699"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M20.5 12H3.67004"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </button>
                    <button
                      class="w-11 h-11 text-xl  border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center border-2"
                      title="Next"
                      data-glide-dir=">"
                      onClick={() => select(SelectionMovement.NEXT)}
                    >
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M14.4301 5.92993L20.5001 11.9999L14.4301 18.0699"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M3.5 12H20.33"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div class="w-full md:w-4/5 lg:w-2/3">
                <a
                  class="nc-CardLarge1__right block relative"
                  href={(window as any).REBLEND_BASE_PATHNAME + "/article/" + articles[currentArticlePosition].slug}
                >
                  <div class="aspect-w-16 aspect-h-12 sm:aspect-h-9 md:aspect-h-14 lg:aspect-h-10 2xl:aspect-h-9 relative">
                    <img
                      src={(window as any).REBLEND_BASE_PATHNAME + 
                        BASE + articles[currentArticlePosition].coverImageUrl
                      }
                      alt={articles[currentArticlePosition].title}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      class="absolute inset-0 object-cover rounded-3xl object-cover absolute inset-0 w-full h-full"
                    />
                  </div>
                  <div
                    class="nc-PostTypeFeaturedIcon absolute w-8 h-8 md:w-10 md:h-10 right-6 top-6"
                    data-nc-id="PostTypeFeaturedIcon"
                  ></div>
                </a>
              </div>
            </div>
          </div>
          <a href={(window as any).REBLEND_BASE_PATHNAME + "/#"} class="nc-SectionAds block text-center mx-auto ">
            <span class="text-xs text-neutral-500">- Advertisement -</span>
            <img
              src="data:image/png;base64,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"
              class="mx-auto"
              alt="ads"
            />
          </a>
        </>
      )}
    </div>
  );
}

export default EditorsPick;
