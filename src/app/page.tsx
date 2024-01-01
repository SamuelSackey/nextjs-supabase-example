import DetailsButton from "@/components/details-button";
import LoginButton from "@/components/login-button";
import LogoutButton from "@/components/logout-button";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";

export default async function Home() {
  const {
    data: { user },
  } = await createSupabaseServerComponentClient().auth.getUser();

  return (
    <>
      <LoginButton />
      <LogoutButton />

      {user ? (
        <>
          <p>{`username: ${user?.email}`}</p>
          <p>{`email: ${user?.user_metadata?.email}`}</p>
        </>
      ) : null}

      <DetailsButton />
    </>
  );
}
