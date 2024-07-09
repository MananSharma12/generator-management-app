import { createSignal, createEffect, Component, JSX } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { supabase } from "~/supabaseClient";
import type { Session } from "@supabase/supabase-js";

export const ProtectedRoute: Component<{
  children: JSX.Element | JSX.Element[];
}> = (props) => {
  const navigate = useNavigate();
  const [session, setSession] = createSignal<Session | null>(null);

  createEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/login");
      } else {
        setSession(data.session);
      }
    };
    checkSession();
  });

  return session() ? props.children : null;
};
