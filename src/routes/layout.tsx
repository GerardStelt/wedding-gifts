import { component$, Slot } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

import { Header } from '~/components/header/header';


export default component$(() => {
  return (
    <div class="flex flex-col min-h-screen">
      <Header />
      <main class="flex-1">
        <Slot />
      </main>
      <div class="bg-neutral-200"><div class="container">Footer</div></div>
    </div>
  );
});

export const head: DocumentHead = {
  meta: [
    {
      name: 'author',
      content: 'Gerard van der Stelt'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:site_name',
      content: 'Wedding Gifts'
    },
    {
      property: 'og:title',
      content: 'Wedding Gifts - The best day of your life'
    },
    {
      property: 'og:description',
      content: 'We specialize in providing wedding gifts for your guests.'
    },
    {
      property: 'og:image',
      content: '/og-image.jpg'
    },
    {
      property: 'og:image:alt',
      content: 'Wedding Gifts - Specialist in high end wedding gifts'
    },
    {
      property: 'og:locale',
      content: 'nl_NL'
    },
  ],
};