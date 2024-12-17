import { Modal, ModalBody, ModalHeader } from "react-bootstrap";
import { Link, useLocation } from "reblend-router";
import Reblend, {
  SharedConfig,
  useContext,
  useReducer,
  useState,
} from "reblendjs";
import { authTokenContext } from "../context";

function Header() {
  const [auth] = useContext(authTokenContext);

  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showHeader, setShowHeader] = useReducer((prev) => {
    return !prev;
  }, false);

  const location = useLocation();

  const tags: null | string[] = SharedConfig.get("TAGS");

  return (
    <div class="nc-HeaderLogged sticky top-0 w-full z-40">
      <div class="nc-MainNav2Logged relative z-10 bg-white dark:bg-neutral-900 border-b border-slate-100 dark:border-slate-700">
        <div class="container ">
          <div class="h-20 flex justify-between">
            <div class="flex items-center lg:hidden flex-1">
              <div>
                <button
                  class="p-2.5 rounded-lg text-neutral-700 dark:text-neutral-300 focus:outline-none flex items-center justify-center"
                  onClick={setShowHeader}
                >
                  {showHeader ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-7 w-7"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-7 w-7"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div class="lg:flex-1 flex items-center">
              <Link
                className="ttnc-logo inline-block text-primary-6000 flex-shrink-0"
                href="/"
              >
                <img
                  class="mx-auto h-20 w-20"
                  src="/lectureFlixnest.logo.transparent.png"
                  alt="Logo"
                />
              </Link>
            </div>
            <div
              class={`flex-[2] ${
                showHeader ? "" : "hidden"
              } lg:flex justify-center mx-4`}
            >
              <ul
                class={`nc-Navigation items-center ${
                  showHeader ? "bg-white" : "flex"
                }`}
              >
                <li
                  class="menu-item menu-dropdown relative"
                  data-headlessui-state=""
                >
                  <div
                    class="h-20 flex-shrink-0 flex items-center"
                    aria-expanded="false"
                    data-headlessui-state=""
                    id="headlessui-popover-button-:r0:"
                  >
                    <Link
                      className={`inline-flex items-center text-sm lg:text-[15px] font-medium text-slate-700 dark:text-slate-300 py-2.5 px-4 xl:px-5 rounded-full hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 ${
                        (location?.pathname?.startsWith("/") &&
                          location?.pathname?.length === 1) ||
                        location?.pathname?.startsWith("/home")
                          ? "bg-primary text-white"
                          : ""
                      }`}
                      href="/"
                    >
                      Homes
                      {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                        class="ml-1 -mr-1 h-4 w-4 text-slate-400"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                          clip-rule="evenodd"
                        ></path>
                      </svg> */}
                    </Link>
                  </div>
                </li>
                <div style="position: fixed; top: 1px; left: 1px; width: 1px; height: 0px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; border-width: 0px; display: none;"></div>
                {(tags && (tags.length = 2), tags)?.map((tag: any) => (
                  <li
                    class="menu-item menu-dropdown relative"
                    data-headlessui-state=""
                  >
                    <div
                      class="h-20 flex-shrink-0 flex items-center"
                      aria-expanded="false"
                      data-headlessui-state=""
                      id="headlessui-popover-button-:r2:"
                    >
                      <Link
                        className="inline-flex items-center text-sm lg:text-[15px] font-medium text-slate-700 dark:text-slate-300 py-2.5 px-4 xl:px-5 rounded-full hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        href={"/tag/" + tag?.name}
                      >
                        {tag?.name}
                        {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                        class="ml-1 -mr-1 h-4 w-4 text-slate-400"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                          clip-rule="evenodd"
                        ></path>
                      </svg> */}
                      </Link>
                    </div>
                  </li>
                ))}
                <div style="position: fixed; top: 1px; left: 1px; width: 1px; height: 0px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; border-width: 0px; display: none;"></div>

                <li
                  class="menu-item menu-dropdown relative"
                  data-headlessui-state=""
                >
                  <div
                    class="h-20 flex-shrink-0 flex items-center"
                    aria-expanded="false"
                    data-headlessui-state=""
                    id="headlessui-popover-button-:r4:"
                  >
                    <Link
                      className={`inline-flex items-center text-sm lg:text-[15px] font-medium text-slate-700 dark:text-slate-300 py-2.5 px-4 xl:px-5 rounded-full hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 ${
                        location?.pathname?.startsWith("/tag")
                          ? "bg-primary text-white"
                          : ""
                      }`}
                      href="/tag"
                    >
                      Tag
                    </Link>
                  </div>
                </li>
                <li
                  class="menu-item menu-dropdown relative"
                  data-headlessui-state=""
                >
                  <div
                    class="h-20 flex-shrink-0 flex items-center"
                    aria-expanded="false"
                    data-headlessui-state=""
                    id="headlessui-popover-button-:r4:"
                  >
                    <Link
                      className={`inline-flex items-center text-sm lg:text-[15px] font-medium text-slate-700 dark:text-slate-300 py-2.5 px-4 xl:px-5 rounded-full hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 ${
                        location?.pathname?.startsWith("/author")
                          ? "bg-primary text-white"
                          : ""
                      }`}
                      href="/author"
                    >
                      Author
                    </Link>
                  </div>
                </li>
                <li
                  class="menu-item menu-dropdown relative"
                  data-headlessui-state=""
                >
                  <div
                    class="h-20 flex-shrink-0 flex items-center"
                    aria-expanded="false"
                    data-headlessui-state=""
                    id="headlessui-popover-button-:r4:"
                  >
                    <Link
                      className={`inline-flex items-center text-sm lg:text-[15px] font-medium text-slate-700 dark:text-slate-300 py-2.5 px-4 xl:px-5 rounded-full hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 ${
                        location?.pathname?.startsWith("/publisher")
                          ? "bg-primary text-white"
                          : ""
                      }`}
                      href="/publisher/"
                    >
                      Publisher's
                    </Link>
                  </div>
                </li>
                {auth ? null : (
                  <>
                    <li
                      class="menu-item menu-dropdown relative"
                      data-headlessui-state=""
                    >
                      <div
                        class="h-20 flex-shrink-0 flex items-center"
                        aria-expanded="false"
                        data-headlessui-state=""
                        id="headlessui-popover-button-:r4:"
                      >
                        <Link
                          className={`inline-flex items-center text-sm lg:text-[15px] font-medium text-slate-700 dark:text-slate-300 py-2.5 px-4 xl:px-5 rounded-full hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 ${
                            location?.pathname?.startsWith("/login")
                              ? "bg-primary text-white"
                              : ""
                          }`}
                          href="/login"
                        >
                          Login
                        </Link>
                      </div>
                    </li>
                    <li
                      class="menu-item menu-dropdown relative"
                      data-headlessui-state=""
                    >
                      <div
                        class="h-20 flex-shrink-0 flex items-center"
                        aria-expanded="false"
                        data-headlessui-state=""
                        id="headlessui-popover-button-:r4:"
                      >
                        <Link
                          className={`inline-flex items-center text-sm lg:text-[15px] font-medium text-slate-700 dark:text-slate-300 py-2.5 px-4 xl:px-5 rounded-full hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 ${
                            location?.pathname?.startsWith("/signup")
                              ? "bg-primary text-white"
                              : ""
                          }`}
                          href="/signup"
                        >
                          Signup
                        </Link>
                      </div>
                    </li>
                  </>
                )}
                <div style="position: fixed; top: 1px; left: 1px; width: 1px; height: 0px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; border-width: 0px; display: none;"></div>
              </ul>
            </div>
            <div class="flex-1 flex items-center justify-end text-slate-700 dark:text-slate-100">
              {/* <div class="cursor-pointer">
                <button class="flex w-10 h-10 sm:w-12 sm:h-12 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none items-center justify-center">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M22 22L20 20"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </button>
              </div>
              <div class="hidden sm:block">
                <div class="relative" data-headlessui-state="">
                  <button
                    class="
                text-opacity-90
                 group  p-3 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full inline-flex items-center text-base font-medium hover:text-opacity-100
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 relative"
                    type="button"
                    aria-expanded="false"
                    data-headlessui-state=""
                    id="headlessui-popover-button-:r6:"
                  >
                    <span class="w-2 h-2 bg-blue-500 absolute top-2 right-2 rounded-full"></span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 6.43994V9.76994"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                      ></path>
                      <path
                        d="M12.02 2C8.34002 2 5.36002 4.98 5.36002 8.66V10.76C5.36002 11.44 5.08002 12.46 4.73002 13.04L3.46002 15.16C2.68002 16.47 3.22002 17.93 4.66002 18.41C9.44002 20 14.61 20 19.39 18.41C20.74 17.96 21.32 16.38 20.59 15.16L19.32 13.04C18.97 12.46 18.69 11.43 18.69 10.76V8.66C18.68 5 15.68 2 12.02 2Z"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                      ></path>
                      <path
                        d="M15.33 18.8201C15.33 20.6501 13.83 22.1501 12 22.1501C11.09 22.1501 10.25 21.7701 9.65004 21.1701C9.05004 20.5701 8.67004 19.7301 8.67004 18.8201"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div style="position: fixed; top: 1px; left: 1px; width: 1px; height: 0px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; border-width: 0px; display: none;"></div>
              </div> */}
              {auth ? (
                <div class="AvatarDropdown ">
                  <div class="relative flex" data-headlessui-state="">
                    <Link
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none flex items-center justify-center"
                      aria-expanded="false"
                      data-headlessui-state=""
                      href="/author/profile"
                    >
                      <svg
                        class=" w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </Link>
                    <Link
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none flex items-center justify-center"
                      aria-expanded="false"
                      data-headlessui-state=""
                      href="/logout"
                    >
                      <svg
                        class="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 12L19 16M19 16L15 20M19 16H9"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M10 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H10"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </Link>
                  </div>
                  <div style="position: fixed; top: 1px; left: 1px; width: 1px; height: 0px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; border-width: 0px; display: none;"></div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <Modal show={showComingSoon} onHide={() => setShowComingSoon(false)}>
        <ModalHeader onHide={() => setShowComingSoon(false)} closeButton />
        <ModalBody>Feature coming soon...</ModalBody>
      </Modal>
    </div>
  );
}

export default Header;
