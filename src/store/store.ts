import { createStore } from "solid-js/store";
import { Session } from "@supabase/supabase-js";

interface SessionStore {
  session: Session | null;
  loading: boolean;
  progress: number;
}

const [sessionStore, setSessionStore] = createStore<SessionStore>({
  session: null,
  loading: true,
  progress: 0,
});

export { sessionStore, setSessionStore };
