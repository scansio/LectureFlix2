import Reblend, {
  CacheType,
  createContext,
  useContext,
  useState,
} from "reblendjs";
import fetcher from "../../../scripts/SharedFetcher";
import { CREATE_NEWSLETTER } from "../../../scripts/config/RestEndpoints";
import { toast } from "react-toastify";

const subscribedNewsletterContext = createContext<boolean>(false, {
  key: "subscribedNewsletterContext",
  type: CacheType.LOCAL,
});

function Newsletter() {
  const [email, setemail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setsubscribed] = useContext(subscribedNewsletterContext);

  function newsletterSubscribe(e: InputEvent) {
    e.preventDefault();
    setLoading(true);
    fetcher
      .fetch({
        url: CREATE_NEWSLETTER,
        data: {
          email,
        },
      })
      .then((data) => {
        if (data?.connection?.status) {
          setsubscribed(true);
          toast.success(data?.connection?.message);
        } else {
          toast.error(data?.connection?.message || "Error");
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }

  return (
    <div class="nc-PageHome relative pb-20">
      <div class="nc-SectionSubscribe2 relative flex flex-col lg:flex-row items-center pt-16 lg:pt-28">
        <div class="flex-shrink-0 mb-14 lg:mb-0 lg:mr-10 lg:w-2/5">
          <h2 class="font-semibold text-4xl">Join our newsletter &#9993;</h2>
          <span class="block mt-6 text-neutral-500 dark:text-neutral-400">
            Read and share new perspectives on just about any topic. Everyone’s
            welcome.
          </span>
          {/* <ul class="space-y-5 mt-10">
            <li class="flex items-center space-x-4">
              <span class="nc-Badge  inline-flex px-2.5 py-1 rounded-full font-medium text-xs relative text-blue-800 bg-blue-100  ">
                01
              </span>
              <span class="font-medium text-neutral-700 dark:text-neutral-300">
                Get more discount
              </span>
            </li>
            <li class="flex items-center space-x-4">
              <span class="nc-Badge  inline-flex px-2.5 py-1 rounded-full font-medium text-xs relative text-red-800 bg-red-100  ">
                02
              </span>
              <span class="font-medium text-neutral-700 dark:text-neutral-300">
                Get premium magazines
              </span>
            </li>
          </ul> */}
          <form class="mt-10 relative max-w-sm" onSubmit={newsletterSubscribe}>
            <input
              type="email"
              class="block w-full border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200/50 bg-white dark:border-neutral-500 dark:focus:ring-primary-500/30 dark:bg-neutral-900 rounded-full text-sm font-normal h-11 px-4 py-3 "
              required
              placeholder={
                subscribed
                  ? "You have subscribed to our newletter"
                  : "Enter your email"
              }
              onChange={(e) => setemail(e.target.value)}
              disabled={subscribed || loading}
            />
            <button
              class="ttnc-ButtonCircle flex items-center justify-center rounded-full !leading-none disabled:bg-opacity-70 bg-slate-900 hover:bg-slate-800  text-slate-50 absolute transform top-1/2 -translate-y-1/2 right-1 dark:bg-neutral-300 dark:text-black  w-9 h-9  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0"
              type="submit"
              disabled={subscribed || loading}
            >
              {loading ? (
                "..."
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-5 h-5 "
                >
                  <path d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"></path>
                </svg>
              )}
            </button>
          </form>
        </div>
        <div class="flex-grow">
          <img
            sizes="(max-width: 768px) 100vw, 50vw"
            src={(window as any).REBLEND_BASE_PATHNAME + "/static/media/SVG-subcribe2.efb832b25bd6eca32484.png"}
            class="undefined"
            alt="Subscribe"
          />
        </div>
      </div>
    </div>
  );
}

export default Newsletter;
