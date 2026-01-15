import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { HiHeartSolid, HiGiftSolid, HiSparklesSolid } from '@qwikest/icons/heroicons';

import HeroURL from '~/media/hero-wedding.jpg?url';


export default component$(() => {
  return (
    <>
      <section class="relative min-h-screen bg-linear-to-br from-pink-50 via-rose-50 to-amber-50 overflow-hidden">
        {/* Decorative background blurs */}
        <div class="absolute -top-32 -left-32 w-96 h-96 bg-pink-200/60 rounded-full blur-3xl" />
        <div class="absolute top-1/4 right-0 w-80 h-80 bg-rose-200/50 rounded-full blur-3xl" />
        <div class="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-pink-100/60 rounded-full blur-3xl" />
        <div class="absolute -bottom-20 right-1/3 w-72 h-72 bg-amber-100/50 rounded-full blur-3xl" />
        
        {/* Hero Image with overlay */}
        <div class="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${HeroURL})` }} />
        <div class="absolute inset-0 bg-linear-to-b from-transparent via-pink-50/30 to-pink-50/80" />

        <div class="container relative flex min-h-screen">
          <div class="m-auto py-20">
            <div class="max-w-4xl mx-auto px-6 py-12 text-center relative">
              {/* Floating icon */}
              <div class="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-linear-to-br from-pink-400 to-rose-500 shadow-xl shadow-pink-200">
                <HiHeartSolid class="w-10 h-10 text-white" />
              </div>
              
              <div class="space-y-8">
                <p class="text-pink-600 font-medium tracking-widest uppercase text-sm">Welcome to Our</p>
                
                <h1 class="text-5xl md:text-6xl lg:text-7xl font-serif text-gray-800 tracking-wide">
                  Wedding Gift Registry
                </h1>
                
                <div class="flex items-center justify-center gap-4 text-gray-400">
                  <span class="w-16 h-px bg-pink-300" />
                  <HiSparklesSolid class="w-5 h-5 text-pink-400" />
                  <span class="w-16 h-px bg-pink-300" />
                </div>
                
                <p class="text-xl md:text-2xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
                  Thank you for celebrating with us! Browse our gift registry and help
                  us start our new journey together.
                </p>
                
                <div class="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                  <a 
                    href="/list/default" 
                    class="group flex items-center gap-2 px-8 py-4 bg-linear-to-r from-pink-500 to-rose-500 text-white text-lg font-semibold rounded-2xl shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <HiGiftSolid class="w-5 h-5" />
                    View Registry
                  </a>
                  <a 
                    href="/client" 
                    class="group flex items-center gap-2 px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-2xl shadow-lg shadow-gray-200/50 hover:shadow-xl hover:bg-pink-50 hover:-translate-y-0.5 border border-pink-100 transition-all duration-300"
                  >
                    <HiSparklesSolid class="w-5 h-5 text-pink-500" />
                    Manage Gifts
                  </a>
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
