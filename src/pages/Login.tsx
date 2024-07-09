import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { supabase } from "~/supabaseClient";
import { Button } from "~/components/ui/button";
import { showToast } from "~/components/ui/toast.tsx";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email(),
      password: password(),
    });

    if (error) {
      setError(error.message);
      showToast({
        title: "ERROR!",
        description: "Cannot Login",
        variant: "error",
      });
    } else {
      navigate("/");
      showToast({
        title: "SUCCESS!",
        description: "Successfully Logged In!",
        variant: "success",
      });
    }
  };

  return (
    <div class="flex flex-col items-center justify-center min-h-screen">
      <h1 class="text-2xl mb-4">Login</h1>
      <input
        type="email"
        value={email()}
        onInput={(e) => setEmail(e.currentTarget.value)}
        placeholder="Email"
        class="border p-2 mb-2 w-64"
      />
      <input
        type="password"
        value={password()}
        onInput={(e) => setPassword(e.currentTarget.value)}
        placeholder="Password"
        class="border p-2 mb-2 w-64"
      />
      {error() && <p class="text-red-500">{error()}</p>}
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
};
