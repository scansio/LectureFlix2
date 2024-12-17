import { Button, Container, Spinner } from "react-bootstrap";
import Reblend, { useEffect, useRef, useState } from "reblendjs";
import TextArea from "./TextArea";

function RichTextEditor({
  setcontent = () => {},
  content,
}: {
  setcontent: (p: any) => any;
  content: string;
}) {
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState("");
  const [trigger, setTrigger] = useState(false);
  const textArea = new TextArea();
  const editorContainerRef = useRef<HTMLDivElement | undefined>(undefined);
  const [reloading, setReloading] = useState(false);

  let round = 0;
  let intervalId: any;

  const intervalStarter = () => {
    setLoading(true);
    setLoadingError("");
    intervalId = setInterval(() => {
      if ((window as any).$) {
        if ($("#summernote") && ($("#summernote") as any).summernote) {
          try {
            textArea.setOnChangeListener(setcontent);
            ($("#summernote") as any).summernote({
              placeholder: "Write your article here ...",
              width: "100%",
              height: "400",
            });
            content &&
              ($("#summernote") as any).summernote("pasteHTML", content);
          } catch (error) {
            setLoadingError("Could not load editor please reload this page");
          } finally {
            clearInterval(intervalId);
            setLoading(false);
          }
        }
      } else {
        if (round >= 4) {
          clearInterval(intervalId);
          setLoadingError("Could not load editor please reload this page");
          setLoading(false);
        } else {
          round++;
        }
      }
    }, 500);
  };

  //intervalStarter();

  useEffect(() => {
    clearInterval(intervalId);
    try {
      if (
        (window as any).$ &&
        $("#summernote") &&
        ($("#summernote") as any).summernote
      ) {
        ($("#summernote") as any).summernote("destroy");
      }
    } catch (error) {}
    setReloading(false);
    if (editorContainerRef.current) {
      editorContainerRef.current.innerHTML = "";
      editorContainerRef.current.appendChild(textArea);
    }
    intervalStarter();
    return () => {
      if ($ && $("#summernote") && ($("#summernote") as any).summernote) {
        ($("#summernote") as any).summernote("destroy");
      }
      clearInterval(intervalId);
    };
  }, [trigger]);

  return reloading ? null : (
    <>
      <script
        type="text/javascript"
        src="https://code.jquery.com/jquery-3.6.0.min.js"
      ></script>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
      />
      <script
        type="text/javascript"
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
      ></script>
      <link
        href="https://cdn.jsdelivr.net/npm/summernote@0.9.0/dist/summernote-bs5.min.css"
        rel="stylesheet"
      />
      <script src="https://cdn.jsdelivr.net/npm/summernote@0.9.0/dist/summernote-bs5.min.js"></script>
      <div ref={editorContainerRef}>{textArea}</div>

      {loading ? (
        <div>
          Initiating editor please wait...{" "}
          <span>
            <Spinner />
          </span>
        </div>
      ) : loadingError ? (
        <div>
          {loadingError} {"  "}
          <Button
            onClick={() => {
              setReloading(true);
              setTimeout(() => setTrigger((prev) => !prev));
            }}
          >
            Reload editor
          </Button>
        </div>
      ) : null}
    </>
  );
}

export default RichTextEditor;
