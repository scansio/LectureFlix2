import Reblend from "reblendjs";

function BecomeAuthor() {
  return (
    <div class="nc-PageHome relative">
      <div class="relative py-16">
        <div class="absolute inset-y-0 w-screen xl:max-w-[1340px] 2xl:max-w-screen-2xl left-1/2 transform -translate-x-1/2 xl:rounded-[40px] z-0 bg-neutral-100 dark:bg-black dark:bg-opacity-20">
          <span class="sr-only hidden">bg</span>
        </div>
        <div class="nc-SectionBecomeAnAuthor relative flex flex-col lg:flex-row items-center  ">
          <div class="flex-shrink-0 mb-14 lg:mb-0 lg:mr-10 lg:w-2/5">
            <span class="text-xs uppercase tracking-wider font-medium text-neutral-400">
              supper change your planning powers
            </span>
            <h2 class="font-semibold text-3xl sm:text-4xl mt-3">
              Become an author and share your great stories
            </h2>
            <span class="block mt-8 text-neutral-500 dark:text-neutral-400">
              Become an author you can earn extra income by writing articles.
              Read and share new perspectives on just about any topic.
              Everyone’s welcome.
            </span>
            <a
              href="/author/"
              class="nc-Button flex-shrink-0 relative h-auto inline-flex items-center justify-center rounded-full transition-colors border-transparent bg-primary-700 hover:bg-primary-6000 text-primary-50 text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6 mt-8 "
            >
              Become an author
            </a>
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
  );
}

export default BecomeAuthor;
