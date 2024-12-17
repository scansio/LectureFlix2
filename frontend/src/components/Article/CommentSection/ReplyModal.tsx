import {
  Card,
  Modal,
  ModalBody,
  ModalHeader,
  ModalTitle,
  Placeholder,
} from "react-bootstrap";
import Reblend, { IAny, SharedConfig, useEffect, useState } from "reblendjs";
import fetcher from "../../../scripts/SharedFetcher";
import { paginatingUrl } from "../../../scripts/misc";
import {
  ALL_REPLY,
  CREATE_REPLY,
  LIKE_REPLY,
} from "../../../scripts/config/RestEndpoints";
import { ACTIVE, UID } from "../../../scripts/config/contants";

function ReplyModal({
  openReplyModal,
  setOpenReplyModal,
  replyingComment,
}: {
  openReplyModal: boolean;
  setOpenReplyModal: (val: boolean) => void;
  replyingComment: { _id: string; numComments: number; content: string } | null;
}) {
  const [likingReply, setLikingReply] = useState(false);
  const [replys, setReplys] = useState<
    {
      content: string;
      uid: {
        firstname: string;
        lastname: string;
        avatar: string;
        slug: string;
      };
      likeByIds: number[];
      createdAt: { dateString: string };
    }[]
  >([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [replysMetadata, setReplysMetadata] = useState<IAny | null>(null);
  const uid = SharedConfig.getLocalData(UID);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (replyingComment) {
      setLoading(true);
      fetcher
        .fetch(
          paginatingUrl(ALL_REPLY, {
            commentId: replyingComment._id,
            populate: ["uid"],
            $sort: -1,
            status: ACTIVE,
          })
        )
        .then((data) => {
          if (data?.connection?.status) {
            setReplys(
              (data?.data?.results || []).sort(
                (a: any, b: any) => b.createdAt.date - a.createdAt.date
              )
            );
            setReplysMetadata(data?.data?.metadata || null);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [replyingComment]);

  function likeReply(reply: any) {
    if (!reply) {
      return;
    }
    setLikingReply(true);
    fetcher
      .fetch(LIKE_REPLY + reply._id)
      .then((data) => {
        if (data?.connection?.status) {
          if (data.data.liked) {
            reply.likeByIds?.push(uid || 0);
          } else {
            reply.likeByIds =
              reply.likeByIds?.filter((id: any) => id !== (uid || 0)) || [];
          }
        }
        setLikingReply(false);
      })
      .catch(() => {
        setLikingReply(false);
      });
  }

  function submitReply(e: any) {
    e.preventDefault();
    fetcher
      .fetch({
        url: CREATE_REPLY,
        data: {
          commentId: replyingComment?._id,
          content,
        },
      })
      .then((data) => {
        if (data?.connection?.status) {
          setReplys((previousReplys) => [
            data?.data,
            ...(previousReplys || []),
          ]);
          setContent("");
          replyingComment && replyingComment.numComments++;
          //setReloadingEffectTrigger(((prev: boolean) => !prev) as any);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  return (
    <Modal
      show={openReplyModal}
      onHide={() => {
        setOpenReplyModal(false);
      }}
    >
      <ModalHeader>
        <ModalTitle>{replyingComment?.content}</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <div id="comments" class="scroll-mt-20 max-w-screen-md mx-auto pt-5">
          {loading ? (
            <Placeholder as={Card.Title} animation="glow">
              <Placeholder xs={6} />
            </Placeholder>
          ) : (
            <div>
              <h3 class="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
                Responses ({replys?.length})
              </h3>
              <form onSubmit={submitReply} class="nc-SingleCommentForm mt-5">
                <textarea
                  class="block w-full text-sm rounded-xl border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 "
                  rows={4}
                  placeholder="Reply"
                  required
                  value={content}
                  onchange={(e: any) => setContent(e.target.value)}
                />
                <div class="mt-2 space-x-3">
                  <button
                    class="nc-Button flex-shrink-0 relative h-auto inline-flex items-center justify-center rounded-full transition-colors border-transparent bg-primary-700 hover:bg-primary-6000 text-primary-50 text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  "
                    type="submit"
                  >
                    Submit
                  </button>
                  <button
                    class="nc-Button flex-shrink-0 relative h-auto inline-flex items-center justify-center rounded-full transition-colors border-transparent bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  "
                    type="button"
                    onClick={() => {
                      setOpenReplyModal(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        <div class="flex-grow flex flex-col p-4 ml-2 text-sm border border-neutral-200 rounded-xl sm:ml-3 sm:text-base dark:border-neutral-700">
          {replys?.map((reply) => (
            <div>
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
                  href={(window as any).REBLEND_BASE_PATHNAME + "/publisher/" + reply?.uid.slug}
                >
                  {reply?.uid.firstname} {reply?.uid.lastname}
                </a>
                <span class="mx-2">·</span>
                <span class="text-neutral-500 dark:text-neutral-400 text-xs line-clamp-1 sm:text-sm">
                  {reply?.createdAt?.dateString}
                </span>
              </div>
              <span class="block text-neutral-700 mt-2 mb-3 sm:mt-3 sm:mb-4 dark:text-neutral-300">
                {reply?.content}
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
                    likeReply(reply);
                  }}
                  disabled={likingReply}
                >
                  <svg
                    class="h-5 w-5 mr-1"
                    fill={reply.likeByIds?.includes(uid) ? "red" : "none"}
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
                    {reply?.likeByIds?.length}
                  </span>
                </button>
                {/* 
            <button
              class="flex items-center min-w-[68px] rounded-full text-neutral-6000 bg-neutral-100 dark:text-neutral-200 dark:bg-neutral-800 px-3 h-8 hover:bg-teal-50 hover:text-teal-600 dark:hover:text-teal-500 focus:outline-none "
              title="Reply"
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
            </button> */}
              </div>
            </div>
          ))}
        </div>
      </ModalBody>
    </Modal>
  );
}

export default ReplyModal;
