import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { supabase } from "~/supabaseClient";

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
    } else {
      navigate("/");
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
      <button onClick={handleLogin} class="bg-blue-500 text-white p-2 rounded">
        Login
      </button>
    </div>
  );
};
