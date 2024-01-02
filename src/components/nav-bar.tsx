import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";
import LoginButton from "./login-button";
import LogoutButton from "./logout-button";

export default async function NavBar() {
  const {
    data: { session },
    error,
  } = await createSupabaseServerComponentClient().auth.getSession();

  const user = session?.user;

  return <>{user ? <LogoutButton /> : <LoginButton />}</>;
}
