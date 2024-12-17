import Reblend, { SharedConfig, useContext, useState } from "reblendjs";
import { authTokenContext } from "../context";
import { Link, Navigate, redirectTo } from "reblend-router";
import { LOGIN, USER_DETAIL } from "../scripts/config/RestEndpoints";
import fetcher from "../scripts/SharedFetcher";
import { TO_VISIT_URL_KEY, UID } from "../scripts/config/contants";
import { toast, ToastContainer } from "react-toastify";
import { Modal, ModalBody, ModalHeader } from "react-bootstrap";

function Login() {
  const [authToken, setAuthToken] = useContext(authTokenContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function submit(e: any) {
    e.preventDefault();
    setLoading(true);
    const authData = { url: LOGIN, data: { email, password } };

    fetcher
      .fetch(authData)
      .then((data) => {
        if (data?.connection?.status) {
          SharedConfig.setLocalData(UID, data.connection.uid);
          setAuthToken(data.data);
          fetcher
            .fetch(USER_DETAIL + data.connection.uid)
            .then((data1) => {
              if (data1?.connection?.status) {
                SharedConfig.setLocalData("user", data1.data.user);
              }
            })
            .catch(() => {});
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
        <ToastContainer />
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
                      class="mx-auto h-50 w-50 rounded-full"
                      src="/lectureFlixnest.logo.background.webp"
                      alt="Logo"
                    />
                  </Link>
                  <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                  </h2>
                </div>

                <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                  <form class="space-y-6" onSubmit={submit}>
                    <div>
                      <label
                        for="email"
                        class="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Email address
                      </label>
                      <div class="mt-2">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <div class="flex items-center justify-between">
                        <label
                          for="password"
                          class="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Password
                        </label>
                        <div class="text-sm">
                          <button
                            class="font-semibold text-indigo-600 hover:text-indigo-500 a link"
                            onClick={(e: any) => {
                              e.preventDefault();
                              setForgotPassword(true);
                            }}
                          >
                            Forgot password?
                          </button>
                        </div>
                      </div>
                      <div class="mt-2">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="password"
                          required
                          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Sign in"}
                      </button>
                    </div>
                  </form>

                  <p class="mt-10 text-center text-sm text-gray-500">
                    Not a member?{" "}
                    <Link
                      href="/signup"
                      className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div class="flex-grow">
              <img
                sizes="(max-width: 768px) 100vw, 50vw"
                src="/static/media/BecomeAnAuthorImg.02703848a9dd53f8bbac.png"
                class="undefined"
                alt="hero"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Forget password modal starts*/}
      <Modal
        show={forgotPassword}
        onHide={() => setForgotPassword(false)}
        backdrop="static"
      >
        <ModalHeader closeButton onHide={() => setForgotPassword(false)} />
        <ModalBody>
          <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div class="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
              <h2 class="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Change Password
              </h2>
              <div class="mt-4 space-y-4 lg:mt-5 md:space-y-5">
                <div>
                  <label
                    for="email"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="forgot-email"
                    onChange={(e) => setEmail(e.target.value)}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                  <button class="btn btn-primary a link float-right mt-2 mb-4">
                    Get code
                  </button>
                </div>
                <div>
                  <label
                    for="code"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Code
                  </label>
                  <input
                    type="code"
                    name="code"
                    id="code"
                    placeholder="••••••••"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    for="password"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    for="confirm-password"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    type="confirm-password"
                    name="confirm-password"
                    id="confirm-password"
                    placeholder="••••••••"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="newsletter"
                      aria-describedby="newsletter"
                      type="checkbox"
                      class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label
                      for="newsletter"
                      class="font-light text-gray-500 dark:text-gray-300"
                    >
                      I accept the{" "}
                      <a
                        class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        href="#"
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Reset passwod
                </button>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
      {/* Forget password ends */}
    </>
  );
}

export default Login;
