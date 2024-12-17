import { Link } from "reblend-router";
import Reblend from "reblendjs";
import { BASE } from "../../scripts/config/RestEndpoints";

function WrittenBy({
  author,
}: {
  author: null | {
    firstname: string;
    lastname: string;
    bio: string;
    slug: string;
    avatar: string;
  } | null;
}) {
  return (
    <div class="max-w-screen-md mx-auto ">
      <div class="nc-SingleAuthor flex">
        <Link href={"/publisher/" + author?.slug}>
          <div class="wil-avatar relative flex-shrink-0 inline-flex items-center justify-center overflow-hidden text-neutral-100 uppercase font-semibold shadow-inner rounded-full h-12 w-12 text-lg sm:text-xl sm:h-24 sm:w-24 ring-1 ring-white dark:ring-neutral-900">
            <img
              sizes="100px"
              src={BASE! + author?.avatar}
              class="absolute inset-0 w-full h-full object-cover object-cover absolute inset-0 w-full h-full"
              alt="Birrell Chariot"
            />
            <span class="wil-avatar__name">B</span>
          </div>
        </Link>
        <div class="flex flex-col ml-3 max-w-lg sm:ml-5">
          <span class="text-xs text-neutral-400 uppercase tracking-wider">
            WRITTEN BY
          </span>
          <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
            <Link href={"/publisher/" + author?.slug}>
              {author?.firstname} {author?.lastname}
            </Link>
          </h2>
          <span class="block mt-1 text-sm text-neutral-500 sm:text-base dark:text-neutral-300">
            {author?.bio}
            <Link
              className="text-primary-6000 font-medium ml-1"
              href={"/publisher/" + author?.slug}
            >
              Read more
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default WrittenBy;
