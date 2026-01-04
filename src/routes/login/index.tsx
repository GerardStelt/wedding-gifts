import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <>
      <section class="container group">
        
        <input class="hidden peer/panel1" type="radio" name="tab" id="tab-1" checked/>
        <input class="hidden peer/panel2" type="radio" name="tab" id="tab-2" />

        <div class="flex">
          <label for="tab-1" class="p-2 border border-b-0 group-has-[:checked#tab-1]:bg-red-500">Bride</label>
          <label for="tab-2" class="p-2 border border-b-0 group-has-[:checked#tab-2]:bg-red-500">Franchisee</label>
        </div>

        <div class="peer-checked/panel1:block hidden border">Panel 1</div>
        <div class="peer-checked/panel2:block hidden border">Panel 2</div>

      </section>
    </>
  );
});
