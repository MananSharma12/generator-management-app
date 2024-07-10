import { A, useLocation } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";
import { supabase } from "~/supabaseClient";
import { Session } from "@supabase/supabase-js";

import { HomeIcon } from "~/assets/icons/HomeIcon.tsx";
import { CalenderIcon } from "~/assets/icons/CalenderIcon.tsx";
import { Package2Icon } from "~/assets/icons/Package2Icon.tsx";

export const Navigation = () => {
  const location = useLocation();
  const [session, setSession] = createSignal<Session | null>(null);

  onMount(async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  });

  const getLinkClass = (path: string) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
      location.pathname === path
        ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
        : ""
    }`;

  return (
    <div class="h-screen">
      <div class="hidden h-full w-[320px] border-r bg-gray-100/40 dark:bg-gray-800/40 md:block">
        <div class="flex flex-col gap-2">
          <div class="flex h-[60px] items-center border-b px-4">
            <div class="flex items-center gap-2 font-semibold">
              <Package2Icon class="h-6 w-6" />
              <div>Shree HPS Generator Management</div>
            </div>
          </div>
          <div class="flex-1 overflow-auto py-2">
            <nav class="grid items-start px-4 text-sm font-medium">
              {session() ? (
                <>
                  <A href="/" class={getLinkClass("/")}>
                    <HomeIcon class="h-4 w-4" />
                    Dashboard
                  </A>
                  <A href="/warranty" class={getLinkClass("/warranty")}>
                    <CalenderIcon class="h-4 w-4" />
                    Service Due
                  </A>
                </>
              ) : (
                <>
                  <A href="/login" class={getLinkClass("/login")}>
                    Login
                  </A>
                  <A href="/signup" class={getLinkClass("/signup")}>
                    Signup
                  </A>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
