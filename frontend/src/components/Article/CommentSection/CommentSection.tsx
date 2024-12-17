import Reblend, {
  IAny,
  SharedConfig,
  useEffect,
  useMemo,
  useState,
} from "reblendjs";
import fetcher from "../../../scripts/SharedFetcher";
import { paginatingUrl } from "../../../scripts/misc";
import {
  ALL_COMMENT,
  BASE,
  CREATE_COMMENT,
  LIKE_ARTICLE,
  LIKE_COMMENT,
} from "../../../scripts/config/RestEndpoints";
import { ACTIVE, UID } from "../../../scripts/config/contants";
import { Card, Placeholder } from "react-bootstrap";
import ReplyModal from "./ReplyModal";

function CommentSection({
  article,
  setArticleReloadingEffectTrigger,
}: {
  article: { _id: string; likeByIds: number[]; numComments: number };
  setArticleReloadingEffectTrigger: any;
}) {
  const uid = SharedConfig.getLocalData(UID);
  const [discussion, setDiscussion] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [commentsMetadata, setCommentsMetadata] = useState<IAny | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingNextComments, setLoadingNextComments] = useState(false);
  const [likingComment, setLikingComment] = useState(false);
  const [likingArticle, setLikingArticle] = useState(false);
  const [openReplyModal, setOpenReplyModal] = useState(false);

  let replyingComment: any = null;

  useEffect(() => {
    if (article) {
      setLoading(true);
      fetcher
        .fetch(
          paginatingUrl(ALL_COMMENT, {
            articleId: article._id,
            populate: ["uid"],
            $sort: -1,
            status: ACTIVE,
          })
        )
        .then((data) => {
          if (data?.connection?.status) {
            setComments(
              (data?.data?.results || []).sort(
                (a: any, b: any) => b.createdAt.time - a.createdAt.time
              )
            );
            setCommentsMetadata(data?.data?.metadata || null);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [article]);

  function submitDiscussion(e: any) {
    e.preventDefault();
    fetcher
      .fetch({
        url: CREATE_COMMENT,
        data: {
          articleId: article?._id,
          content: discussion,
        },
      })
      .then((data) => {
        if (data?.connection?.status) {
          setComments((previousComments) => [
            data.data,
            ...(previousComments || []),
          ]);
          setDiscussion("");
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  function loadNextComments(e: any) {
    e.preventDefault();
    if (commentsMetadata?.nextUrl) {
      setLoadingNextComments(true);
      fetcher
        .fetch(commentsMetadata?.nextUrl)
        .then((data) => {
          if (data?.connection?.status) {
            setComments((prev) => [
              ...prev,
              ...(data?.data?.results || []),
            ]);
            setCommentsMetadata(data?.data?.metadata || null);
          }
          setLoadingNextComments(false);
        })
        .catch(() => {
          setLoadingNextComments(false);
        });
    }
  }

  function likeComment(comment: any) {
    if (!comment) {
      return;
    }
    setLikingComment(true);
    fetcher
      .fetch(LIKE_COMMENT + comment._id)
      .then((data) => {
        if (data?.connection?.status) {
          if (data.data.liked) {
            comment.likeByIds?.push(uid || 0);
          } else {
            comment.likeByIds =
              comment.likeByIds?.filter((id: any) => id !== (uid || 0)) || [];
          }
        }
        setLikingComment(false);
      })
      .catch(() => {
        setLikingComment(false);
      });
  }

  function likeArticle() {
    if (!article) {
      return;
    }
    setLikingArticle(true);
    fetcher
      .fetch(LIKE_ARTICLE + article._id)
      .then((data) => {
        if (data?.connection?.status) {
          if (data.data.liked) {
            article.likeByIds?.push(uid || 0);
          } else {
            article.likeByIds =
              article.likeByIds?.filter((id) => id !== (uid || 0)) || [];
          }
        }
        setLikingArticle(false);
        setArticleReloadingEffectTrigger &&
          setArticleReloadingEffectTrigger((prev: any) => !prev);
      })
      .catch(() => {
        setLikingArticle(false);
      });
  }

  const remainingNumComments = useMemo(() => {
    return (commentsMetadata?.total || 0) - comments?.length;
  }, [comments?.length, commentsMetadata?.total]);

  return (
    <div>
      {loading ? (
        <Placeholder as={Card.Title} animation="glow">
          <Placeholder xs={6} />
        </Placeholder>
      ) : (
        <>
          <div id="comments" class="scroll-mt-20 max-w-screen-md mx-auto pt-5">
            <ReplyModal
              {...{
                openReplyModal,
                setOpenReplyModal,
                replyingComment,
              }}
            />
            <h3 class="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
              Responses ({comments?.length})
            </h3>
            <form onSubmit={submitDiscussion} class="nc-SingleCommentForm mt-5">
              <textarea
                class="block w-full text-sm rounded-xl border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 "
                rows={4}
                placeholder="Add to discussion"
                required
                value={discussion}
                onchange={(e: any) => setDiscussion(e.target.value)}
              />
              <div class="my-2 space-x-3">
                <button
                  class="nc-Button flex-shrink-0 relative h-auto inline-flex items-center justify-center rounded-full transition-colors border-transparent bg-primary-700 hover:bg-primary-6000 text-primary-50 text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  "
                  type="submit"
                >
                  Submit
                </button>
                {/* <button
              class="nc-Button flex-shrink-0 relative h-auto inline-flex items-center justify-center rounded-full transition-colors border-transparent bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  "
              type="button"
            >
              Cancel
            </button> */}
              </div>
            </form>
          </div>
          <div class="max-w-screen-md mx-auto">
            <ul class="nc-SingleCommentLists space-y-5">
              {comments?.map((comment) => {
                return (
                  <li key={comment._id}>
                    <div class="nc-CommentCard flex ">
                      <div
                        class="wil-avatar relative flex-shrink-0 inline-flex items-center justify-center overflow-hidden text-neutral-100 uppercase font-semibold shadow-inner rounded-full h-6 w-6 text-base sm:text-lg sm:h-8 sm:w-8 mt-4"
                        style=""
                      >
                        <img
                          sizes="100px"
                          src={(window as any).REBLEND_BASE_PATHNAME + 
                            BASE + comment.uid?.avatar ||
                            "/static/media/8.ce5f252ae5871de13c94.jpg"
                          }
                          class="absolute inset-0 w-full h-full object-cover object-cover absolute inset-0 w-full h-full"
                          alt="John Doe"
                        />
                        <span class="wil-avatar__name">J</span>
                      </div>
                      <div class="flex-grow flex flex-col p-4 ml-2 text-sm border border-neutral-200 rounded-xl sm:ml-3 sm:text-base dark:border-neutral-700">
                        <div class="relative flex items-center pr-6">
                          <div class="absolute -right-3 -top-3">
                            <div
                              class="relative inline-block text-left"
                              data-headlessui-state=""
                            >
                              <button
                                class="p-2 text-neutral-500 flex items-center justify-center rounded-lg hover:text-neutral-800 dark:hover:text-neutral-200 sm:hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none"
                                title="More"
                                id="headlessui-menu-button-:r26:"
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
                                  class="h-6 w-6"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                                    clip-rule="evenodd"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                          <a
                            class="flex-shrink-0 font-semibold text-neutral-800 dark:text-neutral-100"
                            href={(window as any).REBLEND_BASE_PATHNAME + "/publisher/" + comment.uid.slug}
                          >
                            {comment.uid.firstname} {comment.uid.lastname}
                          </a>
                          <span class="mx-2">·</span>
                          <span class="text-neutral-500 dark:text-neutral-400 text-xs line-clamp-1 sm:text-sm">
                            {comment?.createdAt?.dateString}
                          </span>
                        </div>
                        <span class="block text-neutral-700 mt-2 mb-3 sm:mt-3 sm:mb-4 dark:text-neutral-300">
                          {comment.content}
                        </span>
                        <div
                          class="nc-CommentCardLikeReply flex items-center space-x-2 "
                          data-nc-id="CommentCardLikeReply"
                        >
                          <button
                            class="min-w-[68px] flex items-center rounded-full leading-none px-3 h-8 text-xs focus:outline-none text-neutral-700 bg-neutral-100 dark:text-neutral-200 dark:bg-neutral-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:text-rose-500"
                            title="Like"
                            onClick={(e: any) => {
                              e.preventDefault();
                              likeComment(comment);
                            }}
                            disabled={likingComment}
                          >
                            <svg
                              class="h-5 w-5 mr-1"
                              fill={
                                comment.likeByIds?.includes(uid)
                                  ? "red"
                                  : "none"
                              }
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill-rule="evenodd"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="1.5"
                                d="M11.995 7.23319C10.5455 5.60999 8.12832 5.17335 6.31215 6.65972C4.49599 8.14609 4.2403 10.6312 5.66654 12.3892L11.995 18.25L18.3235 12.3892C19.7498 10.6312 19.5253 8.13046 17.6779 6.65972C15.8305 5.18899 13.4446 5.60999 11.995 7.23319Z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                            <span class="text-neutral-900 dark:text-neutral-200">
                              {comment.likeByIds?.length}
                            </span>
                          </button>
                          <button
                            class="flex items-center min-w-[68px] rounded-full text-neutral-6000 bg-neutral-100 dark:text-neutral-200 dark:bg-neutral-800 px-3 h-8 hover:bg-teal-50 hover:text-teal-600 dark:hover:text-teal-500 focus:outline-none "
                            title="Reply"
                            onclick={(e: any) => {
                              e.preventDefault();
                              replyingComment = comment;
                              setOpenReplyModal(true);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-[18px] w-[18px] mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="1.5"
                                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                              ></path>
                            </svg>
                            <span>{comment?.numReplys}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="nc-NcModal"></div>
                    <div class="nc-NcModal"></div>
                    <div class="nc-NcModal"></div>
                  </li>
                );
              })}

              {remainingNumComments > 0 ? (
                <button
                  class="nc-Button flex-shrink-0 relative h-auto inline-flex items-center justify-center rounded-full transition-colors border-transparent bg-primary-700 hover:bg-primary-6000 text-primary-50 text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6 dark:bg-primary-700 w-full "
                  disabled={!commentsMetadata?.hasNext || loadingNextComments}
                  onClick={loadNextComments}
                >
                  {loadingNextComments ? (
                    "Loading..."
                  ) : (
                    <>
                      View full comments (+
                      {remainingNumComments} comments)
                    </>
                  )}
                </button>
              ) : null}
            </ul>
            <div></div>
          </div>
          <div class="sticky mt-8 bottom-8 z-40 justify-center">
            <div class="bg-white dark:bg-neutral-800 shadow-lg rounded-full ring-1 ring-offset-1 ring-neutral-900/5 p-1.5 flex items-center justify-center space-x-2 text-xs">
              <button
                class="nc-PostCardLikeAction relative min-w-[68px] flex items-center rounded-full leading-none group transition-colors px-3 h-9 text-xs text-neutral-700 bg-neutral-50 dark:text-neutral-200 dark:bg-neutral-800 hover:bg-rose-50 dark:hover:bg-rose-100 hover:text-rose-600 dark:hover:text-rose-500"
                title="Likes"
                onClick={likeArticle}
                disabled={likingArticle}
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
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
                  {article?.likeByIds?.length || 0}
                </span>
              </button>
              <div class="border-l h-4 border-neutral-200 dark:border-neutral-700"></div>
              <a
                href={(window as any).REBLEND_BASE_PATHNAME + "#comments"}
                class="nc-PostCardCommentBtn relative items-center min-w-[68px] rounded-full text-neutral-6000 bg-neutral-50 transition-colors dark:text-neutral-200 dark:bg-neutral-800 hover:bg-teal-50 dark:hover:bg-teal-100 hover:text-teal-600 dark:hover:text-teal-500  flex px-3 h-9 text-xs "
                title="Comments"
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
                  {article?.numComments || 0}
                </span>
              </a>
              <div class="border-l h-4 border-neutral-200 dark:border-neutral-700"></div>
              <button
                class="w-9 h-9 items-center justify-center bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 rounded-full flex"
                onClick={() => window.scrollTo(0, 0)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                  class="w-4 h-4"
                >
                  <path
                    fill-rule="evenodd"
                    d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
              {/* <button
                class="w-9 h-9 items-center justify-center hidden"
                title="Go to top"
              >
                258%
              </button> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CommentSection;
