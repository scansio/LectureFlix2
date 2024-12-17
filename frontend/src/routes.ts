import Article from "./pages/Article";
import Author from "./pages/Author";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Publisher from "./pages/Publisher";
import RelatedPostByTag from "./pages/RelatedPostByTag";
import Signup from "./pages/Signup";

export const routes = {
  "/": Home,
  "/home": Home,
  "/article/:slug": Article,
  "/tag/:tagName?": RelatedPostByTag,
  "/author*": Author,
  "/publisher/:slug?": Publisher,
  "/login": Login,
  "/signup": Signup,
  "/logout": Logout,
};
