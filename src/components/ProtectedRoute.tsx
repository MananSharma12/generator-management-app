import { createSignal, onMount, Show, Component, JSX } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { supabase } from "~/supabaseClient";
import {
  Progress,
  ProgressLabel,
  ProgressValueLabel,
} from "~/components/ui/progress";
import { showToast } from "~/components/ui/toast.tsx";

export const ProtectedRoute: Component<{
  children: JSX.Element | JSX.Element[];
}> = (props) => {
  const navigate = useNavigate();
  const [session, setSession] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(true);
  const [progress, setProgress] = createSignal(0);

  onMount(async () => {
    setProgress(20);
    const { data, error } = await supabase.auth.getSession();
    setProgress(50);

    try {
      if (error || !data || !data.session) {
        showToast({
          title: "ERROR!",
          description: `Something went wrong ${error}`,
          variant: "error",
        });
        navigate("/login");
      } else {
        setSession(data.session.access_token);
      }
    } catch (error) {
      showToast({
        title: "ERROR!",
        description: `Something went wrong ${error}`,
        variant: "error",
      });
      navigate("/login");
    } finally {
      setLoading(false);
      setProgress(100);
    }
  });

  return (
    <Show
      when={!loading()}
      fallback={
        <div class="flex flex-col items-center justify-center min-h-screen">
          <Progress
            value={progress()}
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
      {session() ? props.children : <div> Redirecting...</div>}
    </Show>
  );
};
