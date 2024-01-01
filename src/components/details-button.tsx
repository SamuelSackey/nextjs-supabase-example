"use client";

import useSession from "@/lib/supabase/use-session";

export default function DetailsButton() {
  const user = useSession()?.user;

  return (
    <>
      {user ? (
        <>
          <button>user name</button>
        </>
      ) : (
        <p>user is not logged in</p>
      )}
    </>
  );
}
