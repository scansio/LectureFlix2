import Reblend, { IAny, useEffect, useMemo, useRef, useState } from "reblendjs";
import { Button, ButtonGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import HistoryComponentsForm from "./HistoryComponentsForm";
import { FaTrash } from "react-icons/fa";
import { IControllerRoute } from "../../interfaces/IControllerRoute";
import fetcher from "../../utils/SharedFetcher";
import ModalBox from "../general/Modal";
import PaginatedTable from "../paginating/PaginatedTable";

function HistoryComponents({
  controllerRoute,
}: {
  controllerRoute: IControllerRoute | undefined;
}) {
  const [reload, setReload] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [itemId, setItemId] = useState("");
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false);
  const [updatingData, setUpdatingData] = useState(null);
  const [fields, setfields] = useState({});
  const [dataName, setdataName] = useState("");
  const [url, seturl] = useState("");

  const deleteUser = async (userId: string) => {
    const fetchData = {
      url: controllerRoute?.baseUrl + "/" + userId,
      method: "DELETE",
    };
    let data = null;
    try {
      data = await fetcher.fetch(fetchData);
    } catch (er) {
      toast.error((er as any).message);
      return;
    }
    if (data?.connection?.status) {
      setShowConfirmDeletion(false);
      setReload(!reload);
      toast.success(data.connection.message);
    } else {
      toast.error(data?.connection?.message || "Error");
    }
  };

  const out = (rowData: any, rowIndex: any) => {
    return (
      <ButtonGroup size="sm">
        <Button
          onClick={() => {
            setShowConfirmDeletion(true);
            setItemId(rowData._id);
          }}
          style={{ padding: "5px" }}
          title="Delete this user"
          variant="danger"
        >
          <FaTrash />
        </Button>
        <Button
          onClick={() => {
            setShowCreateForm(true);
            setUpdatingData(rowData);
          }}
          style={{ padding: "5px" }}
          title="Edit this user"
          variant="warning"
        >
          <i className="fas fa-edit"></i>
        </Button>
      </ButtonGroup>
    );
  };

  const createUserButton = () => {
    return (
      <>
        <Button
          onClick={() => setShowCreateForm(true)}
          style={{ padding: "5px", fontSize: "11px" }}
        >
          Add
        </Button>
      </>
    );
  };

  useEffect(() => {
    if (!controllerRoute) {
      return;
    }
    const ignore: IAny = {
      _id: 1,
      __v: 1,
      status: 1,
      createdAt: 1,
      updatedAt: 1,
    };
    const fields: any = {};
    fields["_id"] = { name: "Id", type: String };
    for (const key of Object.keys(controllerRoute?.schema! || {})) {
      if (!ignore[key]) {
        fields[key] = { name: key, type: String };
      }
    }
    fields["status"] = { name: "Status", type: String };
    fields["createdAt.date"] = { name: "Created", type: Date };
    fields["updatedAt.date"] = {
      name: "Updated",
      type: Date,
      hideFromSearch: true,
    };
    fields["action"] = {
      name: createUserButton,
      type: String,
      virtual: true,
      transform: { out },
    };
    const dataName = `${Array.from(controllerRoute?.tag!).reduce(
      (prev, curr, index) =>
        index === 1 ? prev.toLowerCase() + curr : prev + curr
    )}s`;
    const url = `${controllerRoute?.baseUrl}/all`;

    setfields(fields);
    setdataName(dataName);
    seturl(url);
  }, [controllerRoute]);

  return (
    <>
      <ModalBox
        show={showConfirmDeletion}
        onCancel={() => setShowConfirmDeletion(false)}
        onAccept={() => deleteUser(itemId)}
        header={<h1 className="text-center">Confirm Deletion</h1>}
        type="danger"
        backdrop
      >
        <span>Are Sure you want to delete this user</span>
      </ModalBox>

      <ModalBox
        show={showCreateForm}
        onCancel={() => {
          setShowCreateForm(false);
          setUpdatingData(null);
        }}
        control={false}
        header={
          <h2 className="text-center">{`${updatingData ? "Update" : "Create"} ${
            controllerRoute?.tag
          }`}</h2>
        }
        backdrop
      >
        <HistoryComponentsForm
          setReload={() => setReload(!reload)}
          updates={updatingData as any}
          fields={fields}
          url={controllerRoute?.baseUrl!}
        />
      </ModalBox>

      {url && (
        <PaginatedTable
          url={url}
          dataName={dataName}
          fields={fields}
          primaryKey=""
          /* setData={data => setData(data)} */ forCurrentUser={false}
          reload={reload}
        />
      )}
    </>
  );
}

export default HistoryComponents;
