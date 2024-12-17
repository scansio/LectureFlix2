import { toast } from "react-toastify";
import Reblend, { useEffect, useState } from "reblendjs";
import fetcher from "../../../scripts/SharedFetcher";
import { paginatingUrl } from "../../../scripts/misc";
import { ALL_ARTICLE, BASE } from "../../../scripts/config/RestEndpoints";
import { ACTIVE } from "../../../scripts/config/contants";
import { Card, Placeholder } from "react-bootstrap";
import IArticle from "../IArticle";

function RelatedPost({
  tag,
  exludeArticleId,
}: {
  exludeArticleId?: string | null;
  tag: string | string[];
}) {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<IArticle[]>([]);

  useEffect(() => {
    setLoading(true);
    fetcher
      .fetch(
        paginatingUrl(ALL_ARTICLE, {
          ...(!tag ? {} : { tags: { $all: Array.isArray(tag) ? tag : [tag] } }),
          populate: ["author"],
          published: true,
          status: ACTIVE,
        })
      )
      .then((data) => {
        if (data?.connection?.status) {
          setArticles(
            (data?.data?.results || []).filter(
              (art: any) => !exludeArticleId || art._id !== exludeArticleId
            )
          );
        } else {
          toast.error(data?.connection?.message || "Error");
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.message);
      });
  }, [tag]);

  return (
    <div>
      <div class="nc-Section-Heading relative flex flex-col sm:flex-row sm:items-end justify-between mb-10 text-neutral-900 dark:text-neutral-50">
        <div class="max-w-2xl">
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-semibold capitalize">
            Related posts: {Array.isArray(tag) ? tag.join("| ") : tag}
          </h2>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {loading ? (
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
        ) : (
          articles?.map((article) => (
            <div class="nc-Card11 relative flex flex-col group rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 h-full">
              <div class="block flex-shrink-0 relative w-full rounded-t-3xl overflow-hidden z-10 aspect-w-4 aspect-h-3">
                <div>
                  <div class="nc-PostFeaturedMedia relative w-full h-full">
                    <img
                      src={(window as any).REBLEND_BASE_PATHNAME + BASE + article.coverImageUrl}
                      sizes="(max-width: 600px) 480px, 800px"
                      class="object-cover object-cover absolute inset-0 w-full h-full"
                      alt="featured"
                    />
                    <span class="absolute inset-0 flex items-center justify-center ">
                      <div
                        class="nc-PostTypeFeaturedIcon hover:scale-105 transform cursor-pointer transition-transform"
                        data-nc-id="PostTypeFeaturedIcon"
                      >
                        {/* <span class="bg-neutral-900 bg-opacity-60 rounded-full flex  items-center justify-center text-xl text-white border border-white w-11 h-11">
                            <svg
                              class="w-6 h-6"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M17.13 7.9799C20.96 10.1899 20.96 13.8099 17.13 16.0199L14.04 17.7999L10.95 19.5799C7.13 21.7899 4 19.9799 4 15.5599V11.9999V8.43989C4 4.01989 7.13 2.2099 10.96 4.4199L13.21 5.7199"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-miterlimit="10"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>
                            </svg>
                          </span> */}
                      </div>
                    </span>
                    <a
                      class="block absolute inset-0 "
                      href={(window as any).REBLEND_BASE_PATHNAME + "/article/" + article.slug}
                    >
                      C
                    </a>
                  </div>
                </div>
              </div>
              <a class="absolute inset-0" href={(window as any).REBLEND_BASE_PATHNAME + "/article/" + article.slug}>
                C
              </a>
              <span class="absolute top-3 inset-x-3 z-10">
                <div
                  class="nc-CategoryBadgeList flex flex-wrap space-x-2"
                  data-nc-id="CategoryBadgeList"
                >
                  {article.tags?.map((tag) => (
                    <a
                      class="transition-colors hover:text-white duration-300 nc-Badge  inline-flex px-2.5 py-1 rounded-full font-medium text-xs relative text-yellow-800 bg-yellow-100 hover:bg-yellow-800"
                      href={(window as any).REBLEND_BASE_PATHNAME + `/tag/${tag}`}
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              </span>
              <div class="p-4 flex flex-col space-y-3">
                <div class="nc-PostCardMeta inline-flex items-center flex-wrap text-neutral-800 dark:text-neutral-200 leading-none text-xs">
                  <a
                    class="relative flex items-center space-x-2"
                    href={(window as any).REBLEND_BASE_PATHNAME + "/publisher/" + article.author.slug}
                  >
                    <div class="wil-avatar relative flex-shrink-0 inline-flex items-center justify-center overflow-hidden text-neutral-100 uppercase font-semibold shadow-inner rounded-full h-7 w-7 text-sm ring-1 ring-white dark:ring-neutral-900">
                      <img
                        sizes="100px"
                        src={(window as any).REBLEND_BASE_PATHNAME + 
                          BASE + article.author.avatar ||
                          "data:image/jpeg;base64,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"
                        }
                        class="absolute inset-0 w-full h-full object-cover object-cover absolute inset-0 w-full h-full"
                        alt={
                          !article.author?.firstname
                            ? ""
                            : article.author?.firstname +
                              " " +
                              article.author.lastname
                        }
                      />
                      <span class="wil-avatar__name">F</span>
                    </div>
                    <span class="block text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white font-medium">
                      {article.author?.firstname +
                        " " +
                        article.author.lastname}
                    </span>
                  </a>
                  <span class="text-neutral-500 dark:text-neutral-400 mx-[6px] font-medium">
                    ·
                  </span>
                  <span class="text-neutral-500 dark:text-neutral-400 font-normal">
                    {article.createdAt?.dateString}
                  </span>
                </div>
                <h3 class="nc-card-title block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  <span class="line-clamp-2" title={article.seoDescription}>
                    {article.title}
                  </span>
                </h3>
                <div class="flex items-end justify-between mt-auto">
                  <div class="nc-PostCardLikeAndComment flex items-center space-x-2 relative">
                    <a
                      class="nc-PostCardLikeAction relative min-w-[68px] flex items-center rounded-full leading-none group transition-colors px-3 h-8 text-xs text-neutral-700 bg-neutral-50 dark:text-neutral-200 dark:bg-neutral-800 hover:bg-rose-50 dark:hover:bg-rose-100 hover:text-rose-600 dark:hover:text-rose-500"
                      title="Likes"
                      href={(window as any).REBLEND_BASE_PATHNAME + "/article/" + article?.slug + "/likes"}
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
                        {article.likeByIds?.length || 0}
                      </span>
                    </a>
                    <a
                      class="nc-PostCardCommentBtn relative items-center min-w-[68px] rounded-full text-neutral-6000 bg-neutral-50 transition-colors dark:text-neutral-200 dark:bg-neutral-800 hover:bg-teal-50 dark:hover:bg-teal-100 hover:text-teal-600 dark:hover:text-teal-500 hidden sm:flex  px-3 h-8 text-xs "
                      title="Comments"
                      href={(window as any).REBLEND_BASE_PATHNAME + "/article/" + article?.slug + "/comments"}
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
                        {article?.numComments}
                      </span>
                    </a>
                  </div>
                  {/* <div class="nc-PostCardSaveAction flex items-center space-x-2 text-xs text-neutral-700 dark:text-neutral-300 relative">
                    <button
                      class="nc-NcBookmark relative rounded-full flex items-center justify-center h-8 w-8 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700"
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RelatedPost;
