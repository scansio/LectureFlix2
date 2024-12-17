import Reblend, { useEffect, useMemo, useState } from "reblendjs";
import { ButtonGroup, Button, ProgressBar, Spinner } from "react-bootstrap";
import fetcher from "../../scripts/SharedFetcher";
import { toast } from "react-toastify";
import { DATA_FETCH_LIMIT } from "../../scripts/config/contants";
import { encodeQuery } from "../../scripts/misc";
import { FaSpinner } from "react-icons/fa";

function Paginator(props) {
  const [queryString, setQueryString] = useState(null);
  const [url, setUrl] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.query) {
      const qs = encodeQuery(props.query);
      setQueryString(qs);
      setUrl(`${props.url}?q=${qs}`);
    }
  }, [props.query, props.url]);

  useEffect(() => {
    const search = async () => {
      setLoading(true);
      let data = null;
      try {
        data = await fetcher.fetch(url);
      } catch (er) {
        toast.error(er.message);
        setLoading(false);
      }
      const setD = () => {
        props.setRaw && props.setRaw(data);
        props.setData && props.setData(data?.data?.results || []);
        props.setResults && props.setResults(data?.data?.results || []);
        props.setResult && props.setResult(data?.data?.results || []);
        setLoading(false);
        setMetadata(data?.data?.metadata);
      };

      if (!data?.connection?.status) {
        props.setLoadingError && props.setLoadingError(true);
        data?.connection?.message && toast.error(data?.connection?.message);
        setD();
        return;
      }
      props.setLoadingError && props.setLoadingError(false);
      setD();
    };
    url && search();
  }, [url, props.reload]);

  const renderer = useMemo(() => {
    if (metadata && !props.noPaginator) {
      const firstPageUrl = `${props.url}?page=${1}&size=${
        props.size
          ? props.size
          : metadata?.size
          ? metadata.size
          : DATA_FETCH_LIMIT
      }&q=${queryString}`;

      const previousPageUrl = `${props.url}?page=${
        metadata.previousPage
      }&size=${
        props.size
          ? props.size
          : metadata?.size
          ? metadata.size
          : DATA_FETCH_LIMIT
      }&q=${queryString}`;

      const nextPageUrl = `${props.url}?page=${metadata.nextPage}&size=${
        props.size
          ? props.size
          : metadata?.size
          ? metadata.size
          : DATA_FETCH_LIMIT
      }&q=${queryString}`;

      const lastPageUrl = `${props.url}?page=${metadata.totalPages}&size=${
        props.size
          ? props.size
          : metadata?.size
          ? metadata.size
          : DATA_FETCH_LIMIT
      }&q=${queryString}`;

      const r = [];
      const rmeta = [];

      metadata.hasPrevious &&
        rmeta.push(
          <Button
            disabled={loading}
            onClick={(e) => setUrl(firstPageUrl)}
            key={firstPageUrl}
            style={{
              fontSize: "10px",
              fontWeight: 900,
              padding: "5px !important",
            }}
          >
            {"<<<"}
          </Button>
        );

      metadata.hasPrevious &&
        rmeta.push(
          <Button
            disabled={loading}
            onClick={(e) => setUrl(previousPageUrl)}
            key={previousPageUrl}
            style={{
              fontSize: "10px",
              fontWeight: 900,
              padding: "5px !important",
            }}
          >
            {"<<"}
          </Button>
        );

      metadata.hasNext &&
        rmeta.push(
          <Button
            disabled={loading}
            onClick={(e) => setUrl(nextPageUrl)}
            key={nextPageUrl}
            style={{
              fontSize: "10px",
              fontWeight: 900,
              padding: "5px !important",
            }}
          >
            {">>"}
          </Button>
        );

      metadata.hasNext &&
        rmeta.push(
          <Button
            disabled={loading}
            onClick={(e) => setUrl(lastPageUrl)}
            key={lastPageUrl}
            style={{
              fontSize: "10px",
              fontWeight: 900,
              padding: "5px !important",
            }}
          >
            {">>>"}
          </Button>
        );

      r.push(
        <ButtonGroup
          className={"text-sm btn-group-sm"}
          variant="warning"
          key="btn-group"
        >
          {rmeta}
        </ButtonGroup>
      );

      let pagenums = [];

      for (let page = 1; page <= metadata.totalPages; page++) {
        const pageUrl = `${props.url}?page=${page}&size=${
          props.size
            ? props.size
            : metadata?.size
            ? metadata.size
            : DATA_FETCH_LIMIT
        }&q=${queryString}`;

        const isActive = `${page === metadata.currentPage ? "active" : ""}`;

        // Trying to remove previous page button
        if (isActive && page > 10) {
          pagenums = [];
        }
        pagenums.push(
          <Button
            onClick={(e) => setUrl(pageUrl)}
            key={pageUrl}
            className={isActive}
          >
            {page}
          </Button>
        );
      }

      // Trying to limit number of buttons to 10
      if (pagenums.length > 10) {
        pagenums.length = 10;
      }

      r.push(
        <ButtonGroup
          key="pagenums-group"
          className="btn-group-sm px-2"
          style={{ ...props.style }}
        >
          {pagenums}
        </ButtonGroup>
      );

      r.push(
        <span
          key="page-info"
          className="text-xs badge bg-warning font-xs"
        >{`P${metadata.currentPage} ${metadata.resultCount}/${metadata.totalResults}T`}</span>
      );

      return r;
    }
  }, [metadata]);

  const [now, setNow] = useState(1);
  let timerIds = [];
  function counter() {
    if (loading) {
      setNow(now + 10);
    } else {
      timerIds.forEach((timerId) => clearInterval(timerId));
      timerIds = [];
      setNow(0);
    }
  }

  useEffect(() => {
    if (loading) {
      timerIds.push(setInterval(counter, 5));
    }
  }, [loading]);

  return (
    <>
      {loading ? (
        <ProgressBar
          striped
          animated
          variant="primary"
          min={0}
          now={now}
          max={1000}
          size="sm"
        />
      ) : null}
      <div
        className="d-flex justify-content-between align-items-end"
        style={{
          overflowX: "scroll",
          display: props.hidden ? "none" : "initial",
        }}
      >
        {metadata?.totalPages > 1 ? renderer : null}
      </div>
    </>
  );
}

export default Paginator;
