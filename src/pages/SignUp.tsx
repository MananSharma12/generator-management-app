import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { supabase } from "~/supabaseClient";
import { Button } from "~/components/ui/button";
import { showToast } from "~/components/ui/toast";

export const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: email(),
      password: password(),
    });

    if (error) {
      setError(error.message);
      showToast({
        title: "ERROR!",
        description: "Signup Failed.",
        variant: "error",
      });
    } else {
      const session = data.session;

      if (session) {
        const { access_token, refresh_token } = session;
        const { error: sessionError } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (sessionError) {
          setError(sessionError.message);
          showToast({
            title: "ERROR!",
            description: "Session setting failed.",
            variant: "error",
          });
          return;
        }
        navigate("/");
        showToast({
          title: "SUCCESS!",
          description: "Check your email for Signup confirmation!",
          variant: "success",
        });
      } else {
        setError("No session data available");
        showToast({
          title: "ERROR!",
          description: "Signup failed.",
          variant: "error",
        });
      }
    }
  };

  return (
    <div class="flex flex-col items-center justify-center min-h-screen">
      <h1 class="text-2xl mb-4">Signup</h1>
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
      <Button onClick={handleSignup}>Signup</Button>
    </div>
  );
};
