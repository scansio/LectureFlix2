import { Link, Navigate, redirectTo } from "reblend-router";
import Reblend, { SharedConfig, useContext, useState } from "reblendjs";
import fetcher from "../scripts/SharedFetcher";
import { USER_BASE } from "../scripts/config/RestEndpoints";
import { authTokenContext } from "../context";
import { TO_VISIT_URL_KEY } from "../scripts/config/contants";
import { toast, ToastContainer } from "react-toastify";

function Signup() {
  const [authToken] = useContext(authTokenContext);
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  function submit(e: any) {
    e.preventDefault();
    if (!password || password !== confirmPassword) {
      toast.error("Password mismatched");
      return;
    }
    setLoading(true);
    const authData = {
      url: USER_BASE,
      data: { email, password, firstname, lastname, phone },
    };

    fetcher
      .fetch(authData)
      .then((data) => {
        if (data?.connection?.status) {
          toast.success(data?.connection?.message);
          redirectTo("/login");
        } else {
          toast.error(data?.connection?.message || "Error");
        }
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  }

  return authToken ? (
    <Navigate to={SharedConfig.getFlashData(TO_VISIT_URL_KEY) || "/"} />
  ) : (
    <>
      <div class="container">
        <ToastContainer position="bottom-center" />
        <div class="relative py-16">
          <div class="absolute inset-y-0 w-screen xl:max-w-[1340px] 2xl:max-w-screen-2xl left-1/2 transform -translate-x-1/2 xl:rounded-[40px] z-0 bg-neutral-100 dark:bg-black dark:bg-opacity-20">
            <span class="sr-only hidden">bg</span>
          </div>
          <div class="nc-SectionBecomeAnAuthor relative flex flex-col lg:flex-row items-center  ">
            <div class="flex-shrink-0 mb-14 lg:mb-0 lg:mr-10 lg:w-2/5">
              <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                  <Link href="/">
                    <img
                      class="mx-auto h-50 w-50"
                      src="/lectureFlixnest.logo.transparent.png"
                      alt="Logo"
                    />
                  </Link>
                  <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign up
                  </h2>
                </div>

                <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                  <form class="space-y-6" onSubmit={submit}>
                    <div>
                      <label
                        for="email"
                        class="block text-sm font-medium leading-6 text-gray-900 required"
                      >
                        Email address
                      </label>
                      <div class="mt-2">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                          required
                          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        for="email"
                        class="block text-sm font-medium leading-6 text-gray-900 required"
                      >
                        Firstname
                      </label>
                      <div class="mt-2">
                        <input
                          id="firstname"
                          name="firstname"
                          type="text"
                          value={firstname}
                          onChange={(e) => setFirstname(e.target.value)}
                          autoComplete="firstname"
                          required
                          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        for="email"
                        class="block text-sm font-medium leading-6 text-gray-900 required"
                      >
                        Lastname
                      </label>
                      <div class="mt-2">
                        <input
                          id="lastname"
                          name="lastname"
                          type="text"
                          value={lastname}
                          onChange={(e) => setLastname(e.target.value)}
                          autoComplete="lastname"
                          required
                          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        for="email"
                        class="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Phone
                      </label>
                      <div class="mt-2">
                        <input
                          id="phone"
                          name="phone"
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          autoComplete="phone"
                          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <div class="flex items-center justify-between">
                        <label
                          for="password"
                          class="block text-sm font-medium leading-6 text-gray-900 required"
                        >
                          Password
                        </label>
                      </div>
                      <div class="mt-2">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div>
                      <div class="flex items-center justify-between">
                        <label
                          for="confirm-password"
                          class="block text-sm font-medium leading-6 text-gray-900 required"
                        >
                          Confirm Password
                        </label>
                      </div>
                      <div class="mt-2">
                        <input
                          id="confirm-password"
                          name="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          formNoValidate
                          required
                          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        {loading ? "Processing..." : "Sign up"}
                      </button>
                    </div>
                  </form>

                  <p class="mt-10 text-center text-sm text-gray-500">
                    Already a member?{" "}
                    <Link
                      href="/login"
                      className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                    >
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div class="flex-grow">
              <img
                src="/static/media/onboarding1.png"
                class="w-full"
                alt="hero"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
