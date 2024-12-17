import { Modal, ModalBody, Form, InputGroup } from "react-bootstrap";
import Reblend, { useState } from "reblendjs";
import fetcher from "../../scripts/SharedFetcher";
import { CREATE_TAG } from "../../scripts/config/RestEndpoints";
import { toast } from "react-toastify";

const CreateTag = ({
  openCreateModal,
  tags,
  selectionTags,
  settags,
  setSelectionTags,
  setOpenCreateModal,
}: {
  openCreateModal: boolean;
  tags: string[];
  selectionTags: { name: string }[];
  settags: (t: any) => any;
  setSelectionTags: (t: any) => any;
  setOpenCreateModal: (t: any) => any;
}) => {
  const [creatingTag, setCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  async function createTag(e: any) {
    e.preventDefault();
    setCreatingTag(true);
    fetcher
      .fetch({
        url: CREATE_TAG,
        data: {
          name: newTagName,
        },
      })
      .then((data) => {
        if (data?.connection?.status) {
          settags && settags([...tags, data?.data?.name]);
          setSelectionTags &&
            setSelectionTags([...selectionTags, data?.data]);
          setOpenCreateModal && setOpenCreateModal(false);
        } else {
          toast.error(data?.connection?.message || "Error");
        }
        setCreatingTag(false);
      })
      .catch((error) => {
        setCreatingTag(false);
        toast.error(error.message);
      });
  }
  return (
    <Modal show={openCreateModal} onHide={() => setOpenCreateModal(false)}>
      <ModalBody>
        <Form onSubmit={createTag}>
          <InputGroup>
            <InputGroup.Text className="fw-bold">Tag</InputGroup.Text>
            <Form.Control
              required
              type="text"
              onChange={(e) => setNewTagName(e.target.value)}
              disabled={creatingTag}
            />
            <Form.Control type="submit" disabled={creatingTag} />
          </InputGroup>
        </Form>
      </ModalBody>
    </Modal>
  );
};
export default CreateTag;
