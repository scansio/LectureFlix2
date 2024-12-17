import Reblend, { useEffect, useState } from "reblendjs";
import { ACTIVE } from "../../../scripts/config/contants";
import fetcher from "../../../scripts/SharedFetcher";
import { paginatingUrl } from "../../../scripts/misc";
import { ALL_ARTICLE, BASE } from "../../../scripts/config/RestEndpoints";
import { toast } from "react-toastify";
import { Card, Placeholder } from "react-bootstrap";
import IArticle from "../IArticle";

function MoreFromAuthor({
  exludeArticleId,
  uid,
}: {
  exludeArticleId?: string | null;
  uid: number;
}) {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<IArticle[]>([]);

  useEffect(() => {
    setLoading(true);
    fetcher
      .fetch(
        paginatingUrl(ALL_ARTICLE, {
          author: uid,
          populate: ["author"],
          status: ACTIVE,
          published: true,
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
    // eslint-disable-next-line reblend-hooks/exhaustive-deps
  }, []);

  return (
    <div class="mt-20">
      <div class="nc-Section-Heading relative flex flex-col sm:flex-row sm:items-end justify-between mb-10 text-neutral-900 dark:text-neutral-50">
        <div class="max-w-2xl">
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-semibold">
            More from author
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
            <div class="nc-Card9 relative flex flex-col group rounded-3xl overflow-hidden z-0  h-full">
              <div class="absolute inset-x-0 top-0 p-3 flex items-center justify-between transition-all opacity-0 z-[-1] group-hover:opacity-100 group-hover:z-10 duration-300">
                <div class="nc-PostCardLikeAndComment flex items-center space-x-2 relative">
                  <a
                    class="nc-PostCardLikeAction relative min-w-[68px] flex items-center rounded-full leading-none group transition-colors px-3 h-8 text-xs text-neutral-700 bg-neutral-50 dark:text-neutral-200 dark:bg-neutral-800 hover:bg-rose-50 dark:hover:bg-rose-100 hover:text-rose-600 dark:hover:text-rose-500"
                    title="Liked"
                    href={"/article/" + article.slug}
                  >
                    <svg
                      width="24"
                      height="24"
                      fill={article.likeByIds?.includes(uid) ? "red" : "none"}
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
                      {article.likeByIds?.length}
                    </span>
                  </a>
                  <a
                    class="nc-PostCardCommentBtn relative items-center min-w-[68px] rounded-full text-neutral-6000 bg-neutral-50 transition-colors dark:text-neutral-200 dark:bg-neutral-800 hover:bg-teal-50 dark:hover:bg-teal-100 hover:text-teal-600 dark:hover:text-teal-500 hidden sm:flex  px-3 h-8 text-xs "
                    title="Comments"
                    href={"/article/" + article.slug}
                  >
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
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
                {/* <div
              class="nc-PostCardSaveAction flex items-center space-x-2 text-xs text-neutral-700 dark:text-neutral-300 relative"

            >
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
              <div class="flex items-start relative w-full aspect-w-3 aspect-h-3 sm:aspect-h-4"></div>
              <div class="absolute inset-0">
                <div class="nc-PostFeaturedMedia relative w-full h-full">
                  <img
                    src={BASE + article.coverImageUrl}
                    sizes="(max-width: 600px) 480px, 800px"
                    class="object-cover object-cover absolute inset-0 w-full h-full"
                    alt="featured"
                  />
                  <div class="nc-ButtonPlayMusicPlayer select-none absolute inset-0 bg-neutral-900/30 flex items-center justify-center">
                    <div
                      class="nc-PostTypeFeaturedIcon z-20 hover:scale-105 transform cursor-pointer transition-transform"
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
                            d="M6.28016 22C8.00328 22 9.40016 20.6031 9.40016 18.88C9.40016 17.1569 8.00328 15.76 6.28016 15.76C4.55703 15.76 3.16016 17.1569 3.16016 18.88C3.16016 20.6031 4.55703 22 6.28016 22Z"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M20.8404 7.96009V4.60009C20.8404 2.00009 19.2104 1.64009 17.5604 2.09009L11.3204 3.79009C10.1804 4.10009 9.40039 5.00009 9.40039 6.30009V8.47009V9.93009V18.8701"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M20.8398 16.8V12"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M17.7196 19.9199C19.4427 19.9199 20.8396 18.5231 20.8396 16.7999C20.8396 15.0768 19.4427 13.6799 17.7196 13.6799C15.9965 13.6799 14.5996 15.0768 14.5996 16.7999C14.5996 18.5231 15.9965 19.9199 17.7196 19.9199Z"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M9.40039 9.5199L20.8404 6.3999"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                        </svg>
                      </span> */}
                    </div>
                  </div>
                  <a
                    class="block absolute inset-0 "
                    href={"/article/" + article.slug}
                  >
                    C
                  </a>
                </div>
              </div>
              <a
                class="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black opacity-50"
                href={"/article/" + article.slug}
              >
                C
              </a>
              <div class="absolute bottom-0 inset-x-0 p-4 flex flex-col flex-grow">
                <a class="absolute inset-0" href={"/article/" + article.slug}>
                  c
                </a>
                <div class="mb-3">
                  <div
                    class="nc-CategoryBadgeList flex flex-wrap space-x-2"
                    data-nc-id="CategoryBadgeList"
                  >
                    {article.tags?.map((tag: any) => (
                      <a
                        class="transition-colors hover:text-white duration-300 nc-Badge  inline-flex px-2.5 py-1 rounded-full font-medium text-xs relative text-yellow-800 bg-yellow-100 hover:bg-yellow-800"
                        href={"/tag/" + tag}
                      >
                        {tag}
                      </a>
                    ))}
                  </div>
                </div>
                <div class="inline-flex items-center text-xs text-neutral-300">
                  <div class="block ">
                    <h2 class="block text-base sm:text-lg font-semibold text-white ">
                      <span class="line-clamp-2" title={article.seoDescription}>
                        {article.title}
                      </span>
                    </h2>
                    <a
                      class="flex mt-2.5 relative"
                      href={"/publisher/" + article.author?.slug}
                    >
                      <span class="block text-neutral-200 hover:text-white font-medium truncate">
                        {article.author?.firstname} {article.author?.lastname}
                      </span>
                      <span class="mx-[6px] font-medium">·</span>
                      <span class="font-normal truncate">
                        {article.createdAt?.dateString}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MoreFromAuthor;
