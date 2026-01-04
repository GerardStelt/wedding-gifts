import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import HeroURL from '~/media/hero-wedding.jpg?url';


export default component$(() => {
  return (
    <>
      <section class="relative h-screen bg-cover bg-center" style={{ backgroundImage: `url(${HeroURL})` }}>
        <div class="absolute inset-0  bg-linear-to-r from-white/95 via-white/80 to-white/60"></div>

        <div class="container relative flex h-full">
          <div class="m-auto">
            <div class="max-w-4xl mx-auto px-6 py-12 text-center relative" >
              <div class="space-y-8">
                <h1 class="text-5xl md:text-6xl font-serif font-light text-gray-800 tracking-wide">
                  Our Wedding Gift Registry
                </h1>
                <p class="text-xl md:text-2xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
                  Thank you for celebrating with us! Browse our gift registry and help
                  us start our new journey together.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <a href="/registry" class="btn btn-primary elevation">View Registry</a>
                  <a href="/manage" class="btn btn-outline elevation">Manage Gifts</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
});

export const head: DocumentHead = {
  title: "Wedding Gifts",
  meta: [
    {
      name: "description",
      content: "Browse and contribute to our wedding gift registry",
    },
  ],
};
