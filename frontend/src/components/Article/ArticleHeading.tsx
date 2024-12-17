import { Card, Placeholder } from "react-bootstrap";
import Reblend from "reblendjs";
import { BASE } from "../../scripts/config/RestEndpoints";
import IArticle from "./IArticle";

function ArticleHeading({ article }: { article: IArticle | null }) {
  return (
    <div class="nc-PageSingle pt-8 lg:pt-16">
      <header class="container rounded-xl">
        <div class="max-w-screen-md mx-auto">
          <div class="nc-SingleHeader ">
            <div class="space-y-5">
              <div
                class="nc-CategoryBadgeList flex flex-wrap space-x-2"
                data-nc-id="CategoryBadgeList"
              >
                {!article ? (
                  <Placeholder as={Card.Title} animation="glow">
                    <Placeholder xs={6} />
                  </Placeholder>
                ) : (
                  article.tags?.map((tag: string) => (
                    <a
                      class="transition-colors hover:text-white duration-300 nc-Badge  inline-flex px-2.5 py-1 rounded-full font-medium text-xs !px-3 text-red-800 bg-red-100 hover:bg-red-800"
                      href={(window as any).REBLEND_BASE_PATHNAME + `/tag/${tag}`}
                    >
                      {tag}
                    </a>
                  ))
                )}
              </div>
              <h1
                class=" text-neutral-900 font-semibold text-3xl md:text-4xl md:!leading-[120%] lg:text-5xl dark:text-neutral-100 max-w-4xl "
                title={article?.title || ""}
              >
                {!article ? (
                  <Placeholder as={Card.Title} animation="glow">
                    <Placeholder xs={6} />
                  </Placeholder>
                ) : (
                  article.title
                )}
              </h1>
              <span class="block text-base text-neutral-500 md:text-lg dark:text-neutral-400 pb-1">
                {!article ? (
                  <Placeholder as={Card.Title} animation="glow">
                    <Placeholder xs={6} />
                  </Placeholder>
                ) : (
                  article.seoDescription
                )}
              </span>
              <div class="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
              <div class="flex flex-col sm:flex-row justify-between sm:items-end space-y-5 sm:space-y-0 sm:space-x-5">
                <div class="nc-PostMeta2 flex items-center flex-wrap text-neutral-700 text-left dark:text-neutral-200 text-sm leading-none flex-shrink-0">
                  {!article ? (
                    <Placeholder as={Card.Title} animation="glow">
                      <Placeholder xs={6} />
                    </Placeholder>
                  ) : (
                    <a
                      class="flex items-center space-x-2"
                      href={(window as any).REBLEND_BASE_PATHNAME + "/publisher/" + article.author?.slug}
                    >
                      <div class="wil-avatar relative flex-shrink-0 inline-flex items-center justify-center overflow-hidden text-neutral-100 uppercase font-semibold shadow-inner rounded-full shadow-inner h-10 w-10 sm:h-11 sm:w-11 text-xl ring-1 ring-white dark:ring-neutral-900">
                        <img
                          sizes="100px"
                          src={(window as any).REBLEND_BASE_PATHNAME + 
                            BASE + article.author?.avatar ||
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
                    </a>
                  )}
                  <div class="ml-3">
                    {!article ? (
                      <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={6} />
                      </Placeholder>
                    ) : (
                      <>
                        <div class="flex items-center">
                          <a
                            class="block font-semibold"
                            href={(window as any).REBLEND_BASE_PATHNAME + "/author/" + article.author?.slug}
                          >
                            {article.author?.firstname +
                              " " +
                              article.author.lastname}
                          </a>
                        </div>
                        <div class="text-xs mt-[6px]">
                          <span class="text-neutral-700 dark:text-neutral-300">
                            {article.createdAt?.dateString}
                          </span>
                          <span class="mx-2 font-semibold">·</span>
                          {/* <span class="text-neutral-700 dark:text-neutral-300">
                            2 min read
                          </span> */}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div class="nc-SingleMetaAction2 ">
                  {!article ? (
                    <Placeholder as={Card.Title} animation="glow">
                      <Placeholder xs={6} />
                    </Placeholder>
                  ) : (
                    <div class="flex flex-row space-x-2.5 items-center">
                      <div class="nc-PostCardLikeAndComment flex items-center space-x-2 !space-x-2.5">
                        <a
                          href={(window as any).REBLEND_BASE_PATHNAME + "#comments"}
                          class="nc-PostCardLikeAction relative min-w-[68px] flex items-center rounded-full leading-none group transition-colors px-4 h-9 text-sm text-neutral-700 bg-neutral-50 dark:text-neutral-200 dark:bg-neutral-800 hover:bg-rose-50 dark:hover:bg-rose-100 hover:text-rose-600 dark:hover:text-rose-500"
                          title="Like"
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
                          href={(window as any).REBLEND_BASE_PATHNAME + "#comments"}
                          class="nc-PostCardCommentBtn relative items-center min-w-[68px] rounded-full text-neutral-6000 bg-neutral-50 transition-colors dark:text-neutral-200 dark:bg-neutral-800 hover:bg-teal-50 dark:hover:bg-teal-100 hover:text-teal-600 dark:hover:text-teal-500 hidden sm:flex  px-4 h-9 text-sm "
                          title="Comments"
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
                            {article.numComments || 0}
                          </span>
                        </a>
                      </div>
                      <div class="px-1">
                        <div class="border-l border-neutral-200 dark:border-neutral-700 h-6"></div>
                      </div>
                      {/* <button
                        class="nc-NcBookmark relative rounded-full flex items-center justify-center h-9 w-9 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200"
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
                      <div
                        class="relative inline-block text-left"
                        data-headlessui-state=""
                      >
                        <button
                          class="flex-shrink-0 flex items-center justify-center focus:outline-none h-9 w-9 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-full"
                          title="More"
                          id="headlessui-menu-button-:r24:"
                          type="button"
                          aria-haspopup="menu"
                          aria-expanded="false"
                          data-headlessui-state=""
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="1.5"
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            ></path>
                          </svg>
                        </button>
                      </div> */}
                      <div>
                        <div
                          class="relative inline-block text-left"
                          data-headlessui-state=""
                        >
                          <button
                            class="text-neutral-500 dark:text-neutral-400 flex items-center justify-center rounded-full  h-9 w-9 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 focus:outline-none"
                            title="More"
                            id="headlessui-menu-button-:r25:"
                            type="button"
                            aria-haspopup="menu"
                            aria-expanded="false"
                            data-headlessui-state=""
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              aria-hidden="true"
                              data-slot="icon"
                              class="h-5 w-5"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </button>
                        </div>
                        <div class="nc-NcModal"></div>
                        <div class="nc-NcModal"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div class="container my-10 sm:my-12">
        {!article ? (
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
        ) : (
          <img
            src={(window as any).REBLEND_BASE_PATHNAME + 
              article.coverImageUrl?.startsWith("base:") ||
              article.coverImageUrl?.startsWith("blob:")
                ? article.coverImageUrl
                : BASE + article.coverImageUrl
            }
            width="1260"
            height="750"
            alt="single"
            sizes="(max-width: 1024px) 100vw, 1280px"
            class="w-full rounded-xl"
          />
        )}
      </div>
    </div>
  );
}

export default ArticleHeading;
