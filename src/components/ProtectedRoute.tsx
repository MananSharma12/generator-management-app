import { Component, JSX, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { supabase } from "~/supabaseClient";

export const ProtectedRoute: Component<{
  children: JSX.Element | JSX.Element[];
}> = (props) => {
  const navigate = useNavigate();

  onMount(async () => {
    const { data, error } = await supabase.auth.getSession();
    if (!data.session || error) {
      navigate("/login");
    }
  });

  return <>{props.children}</>;
};
