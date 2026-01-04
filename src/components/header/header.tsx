import { component$, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { HiBars3Solid, HiXMarkSolid } from '@qwikest/icons/heroicons';


export const Header = component$(() => {
  const input = useSignal<HTMLInputElement>();

  return (
    <header class="fixed top-0 left-0 right-0 z-50 py-2 bg-pink-500 shadow has-checked:h-dvh">
      <div class="container grid grid-rows-[auto_1fr] grid-cols-[1fr_auto] sm:grid-cols-[auto_1fr_auto] items-center h-full">
        <Link href="/" class="text-4xl text-white font-black uppercase">Logo</Link>

        <input type="checkbox" id="menu-toggle" class="hidden peer" onChange$={(_, { checked }) => document.body.classList.toggle('no-scroll', checked)} ref={input} />
        <label for="menu-toggle" class="sm:hidden peer-checked:hidden"><HiBars3Solid class="size-8 text-white" /></label>
        <label for="menu-toggle" class="hidden peer-checked:block"><HiXMarkSolid class="size-8 text-white" /></label>

        <div class="sm:contents hidden peer-checked:flex flex-col justify-between col-span-2 pt-8 h-full">
          <nav onClick$={() => input.value!.checked = false}>
            <ul class="flex gap-4 max-sm:flex-col max-sm:text-lg justify-center">
              <li><Link href="/diensten" class="btn block text-white hover:text-pink-50 max-sm:px-0">For Brides</Link></li>
              <li><Link href="/over-ons" class="btn block text-white hover:text-pink-50 max-sm:px-0">For Guests</Link></li>
              <li><Link href="/inspiratie" class="btn block text-white hover:text-pink-50 max-sm:px-0">Franchise</Link></li>
              <li><Link href="/contact" class="btn block text-white hover:text-pink-50 max-sm:px-0">How it Works</Link></li>
            </ul>
          </nav>

          <Link href="/login" class="btn btn-outline raised border-white text-white bg-pink-500 border-2">Sign in</Link>
        </div>
      </div>
    </header>
  );
});
