import { onMount, Show, Component, JSX } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { supabase } from "~/supabaseClient";
import {
  Progress,
  ProgressLabel,
  ProgressValueLabel,
} from "~/components/ui/progress";
import { showToast } from "~/components/ui/toast.tsx";
import { sessionStore, setSessionStore } from "~/store/store.ts";

export const ProtectedRoute: Component<{
  children: JSX.Element | JSX.Element[];
}> = (props) => {
  const navigate = useNavigate();

  onMount(async () => {
    setSessionStore("progress", 20);
    const { data, error } = await supabase.auth.getSession();
    setSessionStore("progress", 50);

    if (error || !data || !data.session) {
      showToast({
        title: "ERROR!",
        description: `Something went wrong ${error}`,
        variant: "error",
      });
      navigate("/login");
    } else {
      console.log(data);
      setSessionStore("session", data.session);
    }

    setSessionStore("loading", false);
    setSessionStore("progress", 100);
  });

  return (
    <Show
      when={!sessionStore.loading}
      fallback={
        <div class="flex flex-col items-center justify-center min-h-screen">
          <Progress
            value={sessionStore.progress}
            minValue={0}
            maxValue={100}
            class="w-[300px] space-y-1"
          >
            <div class="flex justify-between">
              <ProgressLabel>Loading...</ProgressLabel>
              <ProgressValueLabel />
            </div>
          </Progress>
        </div>
      }
    >
      {sessionStore.session ? props.children : <div> Redirecting...</div>}
    </Show>
  );
};
