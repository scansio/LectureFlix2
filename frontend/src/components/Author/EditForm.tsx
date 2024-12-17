import Reblend, {
  useState,
  useEffect,
  useRef,
  SharedConfig,
  IAny,
} from "reblendjs";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from "react-bootstrap";
import { useParams } from "reblend-router";
import fetcher from "../../scripts/SharedFetcher";
import { toast } from "react-toastify";
import {
  ALL_TAG,
  BASE,
  CREATE_ARTICLE,
} from "../../scripts/config/RestEndpoints";
import { paginatingUrl } from "../../scripts/misc";
import { ACTIVE } from "../../scripts/config/contants";
import CreateTag from "./CreateTag";
import RichTextEditor from "./RichTextEditor";
import Article from "../../pages/Article";
import IArticle from "../Article/IArticle";

function EditForm({ data }: { data: IArticle | null }) {
  const dataIdRef = useRef("");

  const [isUpdate, setIsUpdate] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  const [previewOfArticle, setPreviewOfArticle] = useState<
    IArticle | undefined
  >(undefined);

  const [slug, setslug] = useState("");
  const [content, setcontent] = useState("");
  const [title, settitle] = useState("");
  const [coverImage, setcoverImage] = useState<File | null>(null);
  const [coverImageUrl, setcoverImageUrl] = useState("");
  const [urlChanged, seturlChanged] = useState(false);
  const [seoDescription, setseoDescription] = useState("");
  const [tags, settags] = useState<string[]>([]);
  const [selectionTags, setSelectionTags] = useState<{ name: string }[]>(
    SharedConfig.get("TAGS") || []
  );
  const [published, setpublished] = useState(true);

  const [status, setStatus] = useState(0);
  const {
    _id,
    firstname,
    lastname,
    slug: authorSlug,
    avatar,
    bio,
  } = SharedConfig.getLocalData("user") || {};
  const author = { _id, firstname, lastname, slug: authorSlug, avatar, bio };

  useEffect(() => {
    if (data) {
      (dataIdRef.current as any) = data._id;
      setslug(data.slug);
      setcontent(data.content);
      settitle(data.title);
      setcoverImageUrl(data.coverImageUrl);
      setseoDescription(data.seoDescription);
      settags(data.tags);
      setpublished(data.published);
      setStatus(data.status);
      setIsUpdate(true);
    }
  }, []);

  useEffect(() => {
    if (coverImage) {
      let url = URL.createObjectURL(coverImage);
      setcoverImageUrl(url);
      seturlChanged(true);
    }
    return () => {
      if (
        coverImageUrl?.startsWith("data://") ||
        coverImageUrl?.startsWith("blob://")
      ) {
        URL.revokeObjectURL(coverImageUrl);
      }
    };
    // eslint-disable-next-line reblend-hooks/exhaustive-deps
  }, [coverImage]);

  useEffect(() => {
    if (title) {
      let tempSlug = title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+$/, "");
      setslug(tempSlug);
    }
  }, [title]);

  const [loadingSeletionTags, setLoadingSelectionTags] = useState(false);
  const [selectionTagsFetched, setSelectionTagsFetched] = useState(false);

  useEffect(() => {
    SharedConfig.set("TAGS", selectionTags);
    if (selectionTagsFetched) {
      return;
    }
    if (selectionTags.length < 1) {
      setLoadingSelectionTags(true);
      fetcher
        .fetch(paginatingUrl(ALL_TAG, { status: ACTIVE }))
        .then((data) => {
          if (data?.connection?.status) {
            setSelectionTags(data?.data?.results || []);
            setSelectionTagsFetched(true);
          }
          setLoadingSelectionTags(false);
        })
        .catch(() => {
          setLoadingSelectionTags(false);
        });
    }
  }, [selectionTags]);

  async function createArticle(e: any) {
    e.preventDefault();
    if (!content || content?.length < 100) {
      toast.error("Too short article");
      return;
    }
    setSubmitting(true);
    let fetchOptiondata: IAny | FormData = {};
    if (coverImage) {
      fetchOptiondata = new FormData();
      fetchOptiondata.append("coverImage", coverImage);
      fetchOptiondata.append("slug", slug);
      fetchOptiondata.append("content", content);
      fetchOptiondata.append("title", title);
      fetchOptiondata.append("seoDescription", seoDescription);
      tags?.forEach((tag) => fetchOptiondata.append("tags", tag));
      fetchOptiondata.append("published", published);
    } else {
      fetchOptiondata = {
        slug,
        content,
        title,
        seoDescription,
        tags,
        published,
      };
    }

    const gdFetchOption = {
      url: CREATE_ARTICLE,
      data: fetchOptiondata,
    };
    coverImage &&
      ((gdFetchOption as any).headers = {
        "Content-Type": "multipart/form-data",
      });
    let data;
    try {
      data = await fetcher.fetch(gdFetchOption);
    } catch (er: any) {
      toast.error(er.message);
    }
    if (data) {
      if (!data?.connection?.status) {
        toast.error(data?.connection?.message);
      } else {
        toast.success(data?.connection?.message);
      }
    }
    setSubmitting(false);
  }

  async function updateArticle(e: any) {
    e.preventDefault();
    if (!content || content?.length < 100) {
      toast.error("Too short article");
      return;
    }
    setSubmitting(true);

    let fetchOptiondata: IAny | FormData = {};
    if (coverImage) {
      fetchOptiondata = new FormData();
      fetchOptiondata.append("coverImage", coverImage);
      fetchOptiondata.append("slug", slug);
      fetchOptiondata.append("content", content);
      fetchOptiondata.append("title", title);
      fetchOptiondata.append("seoDescription", seoDescription);
      tags?.forEach((tag) => fetchOptiondata.append("tags", tag));
      fetchOptiondata.append("published", published);
      fetchOptiondata.append("id", dataIdRef.current);
    } else {
      fetchOptiondata = {
        slug,
        content,
        title,
        seoDescription,
        tags,
        published,
        id: dataIdRef.current,
      };
    }

    const gdFetchOption = {
      url: CREATE_ARTICLE,
      method: "PATCH",
      data: fetchOptiondata,
    };
    coverImage &&
      ((gdFetchOption as any).headers = {
        "Content-Type": "multipart/form-data",
      });
    let data;
    try {
      data = await fetcher.fetch(gdFetchOption);
    } catch (er: any) {
      toast.error(er.message);
    }
    if (data) {
      if (!data?.connection?.status) {
        toast.error(data?.connection?.message);
      } else {
        toast.success(data?.connection?.message);
      }
    }
    setSubmitting(false);
  }

  function preview(e: any) {
    e?.preventDefault();
    const previewOfArticleTemp: IArticle = {
      _id: "6a09a90908f78d7f878ddafd",
      readingTimeInMinute: 0,
      slug,
      coverImageUrl,
      seoDescription,
      title,
      tags,
      likeByIds: [],
      numComments: 0,
      author,
      createdAt: {
        dateString: new Date().toLocaleDateString(),
      },
      published,
      content,
      status,
    };

    setPreviewOfArticle(previewOfArticleTemp);
    setPreviewing(true);
  }

  return (
    <>
      <CreateTag
        {...{
          openCreateModal,
          tags,
          selectionTags,
          settags,
          setSelectionTags,
          setOpenCreateModal,
        }}
      />
      <Form onSubmit={(e) => (isUpdate ? updateArticle(e) : createArticle(e))}>
        <Row>
          <Col xs={12} md={5} lg={5}>
            <Row>
              <Col xs="12" className="p-1 pt-2">
                <InputGroup className="fw-bold">CoverImage</InputGroup>

                <InputGroup className="fw-bold">
                  {coverImageUrl ? (
                    <Image
                      src={(window as any).REBLEND_BASE_PATHNAME + urlChanged ? coverImageUrl : BASE + coverImageUrl}
                    />
                  ) : null}
                </InputGroup>
                <Form.Control
                  type="file"
                  onChange={(e: any) => {
                    setcoverImage(e.target.files[0] as any as File);
                  }}
                />
              </Col>
              <Col xs="12" className="p-1 pt-2">
                <InputGroup className="fw-bold">Title</InputGroup>
                <Form.Control
                  required={true}
                  type="text"
                  value={title}
                  onChange={(e) => settitle(e.target.value)}
                />
              </Col>

              <Col xs="12" className="p-1 pt-2">
                <InputGroup className="fw-bold">Slug</InputGroup>
                <Form.Control
                  required={true}
                  type="text"
                  value={slug}
                  onChange={(e) => setslug(e.target.value?.trim())}
                />
              </Col>
              <Col xs="12" className="p-1 pt-2">
                <InputGroup className="fw-bold">Seo Description</InputGroup>
                <Form.Control
                  required={true}
                  type="text"
                  value={seoDescription}
                  onChange={(e) => setseoDescription(e.target.value)}
                />
              </Col>
              <Col xs="12" className="p-1 pt-2">
                <InputGroup className="fw-bold">Tags</InputGroup>
                <InputGroup size="sm" style={{}}>
                  {loadingSeletionTags ? (
                    <Spinner />
                  ) : (
                    selectionTags?.map(({ name: selectionTag }) => (
                      <Button
                        variant={
                          tags?.includes(selectionTag) ? "primary" : "default"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          if (tags?.includes(selectionTag)) {
                            settags((prev) =>
                              [...prev].filter((preI) => selectionTag !== preI)
                            );
                          } else {
                            settags((prev) => [...prev, selectionTag]);
                          }
                        }}
                      >
                        {selectionTag}
                      </Button>
                    ))
                  )}
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenCreateModal(true);
                    }}
                  >
                    Add tag
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          </Col>
          <Col xs={12} md={7} lg={7}>
            <Row>
              <Col xs="12" className="p-1 pt-2">
                <InputGroup className="fw-bold">Content</InputGroup>
                <InputGroup>
                  <RichTextEditor setcontent={setcontent} content={content} />
                </InputGroup>
              </Col>
            </Row>
          </Col>
        </Row>
        <Container
          className="p-1 pt-2"
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "stretch",
            flexWrap: "wrap",
            alignItems: "stretch",
          }}
        >
          <div>
            <InputGroup style={{ margin: "5px" }}>
              <InputGroup.Text className="fw-bold">
                Published &nbsp;&nbsp;
                <Form.Switch
                  checked={published}
                  onChange={(e) => setpublished(!published)}
                />
              </InputGroup.Text>
            </InputGroup>
          </div>
          <div>
            <InputGroup style={{ margin: "5px" }}>
              <InputGroup.Text className="fw-bold">
                Status &nbsp;&nbsp;
                <Form.Switch
                  checked={!!status}
                  onChange={(e) => setStatus(status ? 0 : 1)}
                />
              </InputGroup.Text>
            </InputGroup>
          </div>
          <div>
            <InputGroup style={{ margin: "5px" }}>
              {submitting ? (
                <Spinner />
              ) : (
                <ButtonGroup>
                  <Form.Control
                    size="sm"
                    type="submit"
                    value={`${isUpdate ? "Update" : "Create"}`}
                    className="fw-bold utilityLink"
                  />
                  <Button onClick={preview}>Preview</Button>
                </ButtonGroup>
              )}
            </InputGroup>
          </div>
        </Container>
      </Form>
      <Modal
        show={previewing}
        onHide={() => setPreviewing(false)}
        size="lg"
        fullscreen
      >
        <ModalHeader onHide={() => setPreviewing(false)} closeButton>
          Preview of "{title}"
        </ModalHeader>
        <ModalBody>
          {previewing ? <Article previewOfArticle={previewOfArticle} /> : null}
        </ModalBody>
      </Modal>
    </>
  );
}
export default EditForm;
