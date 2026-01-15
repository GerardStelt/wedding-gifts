import { $, component$, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { HiBars3Solid, HiXMarkSolid, HiHeartSolid } from '@qwikest/icons/heroicons';


export const Header = component$(() => {
  const input = useSignal<HTMLInputElement>();

  const closeMenu = $(() => document.body.classList.remove('no-scroll'));

  return (
    <header class="fixed top-0 left-0 right-0 z-50 py-3 bg-linear-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-200/50 backdrop-blur-sm has-checked:h-dvh">
      <div class="container grid grid-rows-[auto_1fr] grid-cols-[1fr_auto] sm:grid-cols-[auto_1fr_auto] items-center h-full">
        <Link href="/" class="flex items-center gap-2 text-white group">
          <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 group-hover:bg-white/30 transition-colors">
            <HiHeartSolid class="size-5" />
          </span>
          <span class="text-2xl font-bold tracking-tight">WeddingGifts</span>
        </Link>

        <input type="checkbox" id="menu-toggle" class="hidden peer" onChange$={(_, { checked }) => document.body.classList.toggle('no-scroll', checked)} ref={input} />
        <label for="menu-toggle" class="sm:hidden peer-checked:hidden cursor-pointer p-2 rounded-xl hover:bg-white/10 transition-colors"><HiBars3Solid class="size-7 text-white" /></label>
        <label for="menu-toggle" class="hidden peer-checked:block cursor-pointer p-2 rounded-xl hover:bg-white/10 transition-colors"><HiXMarkSolid class="size-7 text-white" /></label>

        <div class="sm:contents hidden peer-checked:flex flex-col justify-between col-span-2 pt-8 h-full" onClick$={closeMenu}>
          <nav onClick$={() => input.value!.checked = false}>
            <ul class="flex gap-4 max-sm:flex-col max-sm:text-lg justify-center">
              <li><Link href="/#" class="btn block text-white hover:text-pink-50 max-sm:px-0">For Brides</Link></li>
              <li><Link href="/#" class="btn block text-white hover:text-pink-50 max-sm:px-0">For Guests</Link></li>
              <li><Link href="/#" class="btn block text-white hover:text-pink-50 max-sm:px-0">Franchise</Link></li>
              <li><Link href="/#" class="btn block text-white hover:text-pink-50 max-sm:px-0">How it Works</Link></li>
            </ul>
          </nav>

          <Link href="/login" class="inline-flex items-center justify-center px-5 py-2.5 bg-white text-pink-600 font-semibold rounded-xl shadow-md hover:shadow-lg hover:bg-pink-50 transition-all duration-200">Sign in</Link>
        </div>
      </div>
    </header>
  );
});
