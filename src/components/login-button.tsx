"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export default function LoginButton(props: { nextUrl?: string }) {
  const supabase = createSupabaseBrowserClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${
          props.nextUrl || ""
        }`,
      },
    });
  };

  return <button onClick={handleLogin}>Login</button>;
}
