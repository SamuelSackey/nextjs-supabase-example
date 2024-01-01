import DetailsButtonServer from "@/components/details-button-server";
import LoginButton from "@/components/login-button";
import LogoutButton from "@/components/logout-button";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";

export default async function Home() {
  return (
    <>
      <LoginButton />
      <LogoutButton />

      <br />
      <br />

      <DetailsButtonServer />
    </>
  );
}
